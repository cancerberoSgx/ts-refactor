import { prompt } from 'inquirer'
import { cat } from 'shelljs'
import { SourceFile } from 'ts-morph'
import { inquireFormatCodeSettings } from '../../cli/inquire/inquireFormatCodeSettings'
import { File, FIX, FixOptions, FixResult } from '../../fix'
import { getFileRelativePath, isSourceFile } from '../../project'
import { FixWithFormatCodeSettingOptions, FormatCodeSettings } from '../formatTypes'

export interface SimpleFixConstructorActionOptions extends FixOptions {
  file: SourceFile
}
export interface FormatSettingsFixOptions extends FixOptions {
  formatCodeSettings?: FormatCodeSettings
}
export interface SimpleFixConstructorOptions<T extends FormatSettingsFixOptions> {
  action(options: T & { file: SourceFile }): void
  name: FIX
  description?: string
  selectFilesMessage?: string
}

/**
 * A very simple fix that supports format code settings as options (since most refactors will optionally use them.). it has a shortcut for fn() -
 * that subclasses that execute a transformation file per file can use by passing {action} as constructor option.
 *
 * Also they can pass the rest of the info so they don't have to subclass this and just instantiate.
 *
 * See organizeImports, format. See stringConcatenationToTemplate for an example sub classing this to add a new option.
 */
export class FormatSettingsFix<T extends FormatSettingsFixOptions> {
  name: FIX = FIX.arrowFunction

  description: string = 'TODO: document me!'

  protected _selectFilesMessage: string = 'Select input files or folders'

  constructor(protected options?: SimpleFixConstructorOptions<T>) {
    if (options) {
      this.name = options.name
      this.description = options.description || 'TODO: document me!'
      this._selectFilesMessage = options.selectFilesMessage || 'Select input files or folders'
    }
    this.fn = this.fn.bind(this)
    this.inquireOptions = this.inquireOptions.bind(this)
    this.selectFilesMessage = this.selectFilesMessage.bind(this)
    this.verifyInputFiles = this.verifyInputFiles.bind(this)
  }

  selectFilesMessage() {
    return this._selectFilesMessage
  }

  verifyInputFiles(files: File[], options: T): string | undefined {
    return files.length === 0 ? 'At least one input file or folder is required' : undefined
  }

  fn(options: T) {
    if (!this.options) {
      throw 'For calling base fn() implementation you must provide  this.constructorOptions'
    }
    const { project } = options
    const result: FixResult = { files: [] }
    const inputFiles = options.inputFiles
      .map(f => (isSourceFile(f) ? [f] : f.getDescendantSourceFiles()))
      .flat()
      .filter((f, i, a) => a.indexOf(f) === i)
    inputFiles.forEach(file => {
      const t0 = Date.now()
      if (isSourceFile(file)) {
        this.options!.action && this.options!.action({ ...options, file })
        result.files.push({
          name: getFileRelativePath(file, project),
          time: Date.now() - t0
        })
      } else {
        throw `${getFileRelativePath(file, project)} not a source file`
      }
    })
    return result
  }

  async inquireOptions(options: FixWithFormatCodeSettingOptions): Promise<FixWithFormatCodeSettingOptions> {
    return await this.inquireFormatCodeSettings(options)
  }

  protected async inquireFormatCodeSettings(
    options: FixWithFormatCodeSettingOptions
  ): Promise<FixWithFormatCodeSettingOptions> {
    let formatCodeSettings: FormatCodeSettings = {}
    const formatSettingsFile = (options.options.files || []).find(
      f => f.includes('formatCodeSettings') && f.endsWith('.json')
    )
    formatCodeSettings = { ...options.formatCodeSettings, ...formatCodeSettings }
    if (formatSettingsFile) {
      try {
        formatCodeSettings = JSON.parse(cat(formatSettingsFile).toString())
      } catch (error) {
        throw new Error(`Failed to parse given ${formatSettingsFile} file. 
Nor the file doesn't exists or is not valid JSON. 
It must be relative to current directory (not to tsconfig if you are using a custom one)
Error: ${error}`)
      }
    }
    if (!formatCodeSettings) {
      if (options.options.toolOptions && options.options.toolOptions.dontAsk) {
        return { ...options, formatCodeSettings: {} }
      }
      const { configureFormatCodeSettings } = await prompt<{ configureFormatCodeSettings: boolean }>([
        {
          type: 'confirm',
          name: 'configureFormatCodeSettings',
          message: 'Configure Format Code Settings?',
          default: false
        }
      ])
      if (configureFormatCodeSettings) {
        const inquiredFormatCodeSettings = await inquireFormatCodeSettings(options)
        formatCodeSettings = { ...options.formatCodeSettings, ...inquiredFormatCodeSettings }
      }
    }
    return { ...options, formatCodeSettings: formatCodeSettings || {} }
  }
}
