import { prompt } from 'inquirer'
import { Project, SourceFile } from 'ts-morph'
import { inquireFormatCodeSettings } from '../cli/inquire/inquireFormatCodeSettings'
import { FixOptions, FixResult, FIX } from '../fix'
import { getFileRelativePath, isSourceFile } from '../project'
import { FixWithFormatCodeSettingOptions } from './formatTypes'

// /**
//  * builds a fix function suitable for simple fixes like organizeImports, format - that have similar parameters/semantics and make modifications file by file.
//  */
// export function simpleFixConstructor(options: SimpleFixOptions<T>) {
//   return new SimpleFix(options)
// }

export interface SimpleFixOptions extends FixOptions{
  file: SourceFile
}
export interface SimpleFixConstructorOptions<T extends SimpleFixOptions> {
   action (options: T): void 
   name: FIX
   description: string
   selectFilesMessage: string
  }

export class SimpleFix<T extends SimpleFixOptions>{
  name: FIX
  description: string
  selectFilesMessage: string

  constructor(protected constructorOptions: SimpleFixConstructorOptions<T>){
    this.name = constructorOptions.name
    this.description = constructorOptions.description
    this.fn = this.fn.bind(this)
    this.inquireOptions = this.inquireOptions.bind(this)
    this.selectFilesMessage = constructorOptions.selectFilesMessage
  }

  electFilesMessage() {
    return this.selectFilesMessage
  }
  verifyInputFiles(files, options) {
    return files.length === 0 ? 'At least one input file or folder is required' : undefined
  }
  fn(options: T) {
    const { project } = options
    const result: FixResult = { files: [] }
    const inputFiles = options.inputFiles
      .map(f => (isSourceFile(f) ? [f] : f.getDescendantSourceFiles()))
      .flat()
      .filter((f, i, a) => a.indexOf(f) === i)
    inputFiles.forEach(file => {
      const t0 = Date.now()
      if (isSourceFile(file)) {
        this.constructorOptions.action({...options, file})
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

  async inquireOptions(options: FixWithFormatCodeSettingOptions) : Promise<any> {
    if (options.options.toolOptions && options.options.toolOptions.dontAsk) {
      return
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
    }
  }

}