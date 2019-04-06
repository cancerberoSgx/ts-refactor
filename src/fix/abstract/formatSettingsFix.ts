import { prompt } from 'inquirer'
import { SourceFile } from 'ts-morph'
import { inquireFormatCodeSettings } from '../../cli/inquire/inquireFormatCodeSettings'
import { File, FIX, FixOptions, FixResult } from '../../fix'
import { getFileRelativePath, isSourceFile } from '../../project'
import { FixWithFormatCodeSettingOptions } from '../formatTypes'

export interface SimpleFixOptions extends FixOptions {
  file: SourceFile
}
export interface SimpleFixConstructorOptions<T extends SimpleFixOptions> {
  action(options: T): void
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
export class FormatSettingsFix<T extends SimpleFixOptions> {
  name: FIX = FIX.arrowFunction

  description: string = 'TODO: document me!'

  _selectFilesMessage: string = 'Select input files or folders'

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
      const formatCodeSettings = await inquireFormatCodeSettings(options)
      options = { ...options, formatCodeSettings: { ...options.formatCodeSettings, ...formatCodeSettings } }
      return { ...options, formatCodeSettings }
    }
    return { ...options, formatCodeSettings: {} }
  }
}
