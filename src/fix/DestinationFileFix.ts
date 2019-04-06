import { prompt, registerPrompt } from 'inquirer'
import { getAbsolutePath, getFileFromRelativePath, getFilePath, getFileRelativePath, isSourceFile } from '../project'
import { FixWithFormatCodeSettingOptions } from './formatTypes'
import { SimpleFix, SimpleFixOptions } from './FormatSettingsFix'

registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

export interface DestFileFixOptions extends SimpleFixOptions {
  destPath: string
}

export class DestFileFix<T extends DestFileFixOptions> extends SimpleFix<T> {
  protected  destinationSuggestOnly = true
  async inquireOptions(options: FixWithFormatCodeSettingOptions) {
    await super.inquireOptions(options)
    // if there is any non existing file or the last input file is a directory then we assume that's our destination file
    return this.inquireDestinationFile(options)
  }
protected async inquireDestinationFile(options: FixWithFormatCodeSettingOptions): Promise<{destPath: string}> {
  const destinations = (options.options.files || []).filter(f => !getFileFromRelativePath(f, options.project))
  if (destinations.length) {
    return { destPath: getAbsolutePath(destinations.find(f => !isSourceFile(f)) || destinations[0], options.project) }
  } else {
    const { file } = await prompt<{ destPath: string }>([
      {
        type: 'autocomplete',
        name: 'file',
        message: this.getDestinationFileMessage(options),
        // @ts-ignore
        suggestOnly: this.destinationSuggestOnly,
        validate:   (input: string) =>this.validateDestinationFile(options, input),
        // @ts-ignore
        source : (answersSoFar, input: string)=>this.getDestinationPathSource(answersSoFar, input, options)
      }
    ])
    return { destPath: getAbsolutePath(file, options.project) }
  }
  }
  protected validateDestinationFile(options: FixWithFormatCodeSettingOptions, input: string){
    const file = getFileFromRelativePath(input, options.project)
    if (file) {
      return `A ${
        isSourceFile(file) ? 'file' : 'directory'
      } already exists at "${input}", please choose another path. `
    }
    return true
  }
  protected getDestinationFileMessage(options: FixWithFormatCodeSettingOptions): string | ((answers: { destPath: string; }) => string) | undefined {
    return 'Select the destination path'
  }
  protected getDestinationPathSource(answersSoFar: any, input: string, options: FixWithFormatCodeSettingOptions): Promise<{name: string, value: string}[]>{
    return Promise.resolve([
      ...options.project.getSourceFiles()
        .filter(f => getFileRelativePath(f, options.project).includes(input))
        .map(f => ({ name: getFileRelativePath(f, options.project), value: getFilePath(f) }))
        .sort((a, b) => a.name.localeCompare(b.name))
    ]) //TODO: add fuzzy  https://github.com/faressoft/inquirer-checkbox-plus-prompt
  }
}
