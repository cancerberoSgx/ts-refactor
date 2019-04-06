import { prompt, registerPrompt } from 'inquirer'
import { getAbsolutePath, getFileFromRelativePath, getFilePath, getFileRelativePath, isSourceFile } from '../../project'
import { FixWithFormatCodeSettingOptions } from '../formatTypes'
import { FormatSettingsFix, SimpleFixOptions } from './formatSettingsFix'

registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

export interface DestFileFixOptions extends SimpleFixOptions {
  destPath: string
}

/**
 * This extends FormatSettingsFix and add another option: destPath for those fixes that require a destination path option (move file, moveDeclaration, etc).
 * The default behavior is for moveFile, where the destination file must not exists so :
 *  * If there is a non existent file in given file arguments then assumes thats the destination path.
 *  * Other wise it inquires the user to define a non existent file path suggesting from existing files.
 */
export class DestFileFix<T extends DestFileFixOptions> extends FormatSettingsFix<T> {
  // protected destinationSuggestOnly = true
  protected destinationMode: 'mustNotExist' | 'mustExist' | 'mustExistFile' = 'mustNotExist'

  async inquireOptions(options: DestFileFixOptions) {
    const superOptions = await super.inquireOptions(options)
    // if there is any non existing file or the last input file is a directory then we assume that's our destination file
    const thisOptions = await this.inquireDestinationFile(options)
    return { ...options, ...superOptions, ...thisOptions }
  }

  protected async inquireDestinationFile(options: DestFileFixOptions): Promise<{ destPath: string }> {
    let destinations: string[] = []
    if (this.destinationMode === 'mustNotExist') {
      destinations = (options.options.files || []).filter(f => !getFileFromRelativePath(f, options.project))
    } else if (this.destinationMode === 'mustExist') {
      destinations = (options.options.files || []).filter(f => !!getFileFromRelativePath(f, options.project))
      destinations = destinations.length > 1 ? [destinations[destinations.length - 1]] : []
    } else if (this.destinationMode === 'mustExistFile') {
      destinations = (options.options.files || []).filter(f =>
        isSourceFile(getFileFromRelativePath(f, options.project))
      )
      destinations = destinations.length > 1 ? [destinations[destinations.length - 1]] : []
    } else {
      throw new Error('destination mode unknown ' + this.destinationMode)
    }
    if (destinations.length) {
      return {
        destPath: getAbsolutePath(destinations.find(f => !isSourceFile(f)) || destinations[0], options.project)
      }
    } else {
      const { destPath } = await prompt<{ destPath: string }>([
        {
          type: 'autocomplete',
          name: 'destPath',
          message: this.getDestinationFileMessage(options),
          // @ts-ignore
          suggestOnly: this.destinationMode === 'mustNotExist' ? true : false,
          validate: (input: string) => this.validateDestinationFile(options, input),
          // @ts-ignore
          source: (answersSoFar, input: string) => this.getDestinationPathSource(answersSoFar, input, options)
        }
      ])
      return { ...options, destPath }
    }
  }

  protected validateDestinationFile(options: DestFileFixOptions, input: string) {
    const file = getFileFromRelativePath(input, options.project)
    if (file && this.destinationMode === 'mustNotExist') {
      return `A ${isSourceFile(file) ? 'file' : 'directory'} already exists at "${input}", please choose another path. `
    } else if (!file && this.destinationMode === 'mustExist') {
      return `"${input}" ${isSourceFile(file) ? 'file' : 'directory'} doesn't exists, please choose another path. `
    } else if (this.destinationMode === 'mustExistFile') {
      if (file && !isSourceFile(file)) {
        return `"${input}" ${isSourceFile(file) ? 'file' : 'directory'} doesn't exists, please choose another path. `
      } else if (!file) {
        return `"${input}" file doesn't exist in project`
      }
    }
    return true
  }

  protected getDestinationFileMessage(
    options: FixWithFormatCodeSettingOptions
  ): string | ((answers: { destPath: string }) => string) | undefined {
    return 'Select the destination path'
  }

  protected getDestinationPathSource(
    answersSoFar: any,
    input: string,
    options: FixWithFormatCodeSettingOptions
  ): Promise<{ name: string; value: string }[]> {
    return Promise.resolve([
      ...options.project
        .getSourceFiles()
        .filter(f => getFileRelativePath(f, options.project).includes(input))
        .map(f => ({ name: getFileRelativePath(f, options.project), value: getFilePath(f) }))
        .sort((a, b) => a.name.localeCompare(b.name))
    ]) //TODO: add fuzzy  https://github.com/faressoft/inquirer-checkbox-plus-prompt
  }
}
