import { prompt, registerPrompt } from 'inquirer'
import { getAbsolutePath, getFileFromRelativePath, getFilePath, getFileRelativePath, isSourceFile } from '../project'
import { FixWithFormatCodeSettingOptions } from './formatTypes'
import { SimpleFix, SimpleFixOptions } from './simpleFixConstructor'

registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

export class DestFileFix<T extends SimpleFixOptions> extends SimpleFix<T> {
  async inquireOptions(options: FixWithFormatCodeSettingOptions) {
    await super.inquireOptions(options)
    // if there is any non existing file or the last input file is a directory then we assume that's our destination file
    const destinations = (options.options.files || []).filter(f => !getFileFromRelativePath(f, options.project))
    if (destinations.length) {
      return { destPath: getAbsolutePath(destinations.find(f => !isSourceFile(f)) || destinations[0], options.project) }
    } else {
      const { file } = await prompt<{ destPath: string }>([
        {
          type: 'autocomplete',
          name: 'file',
          message: 'Select the destination path',
          // @ts-ignore
          suggestOnly: true,
          validate(input: string) {
            const file = getFileFromRelativePath(input, options.project)
            if (file) {
              return `A ${
                isSourceFile(file) ? 'file' : 'directory'
              } already exists at "${input}", please choose another path. `
            }
            return true
          },
          // @ts-ignore
          source: function(answersSoFar, input: string) {
            return Promise.resolve([
              ...options.inputFiles
                .filter(f => getFileRelativePath(f, options.project).includes(input))
                .map(f => ({ name: getFileRelativePath(f, options.project), value: getFilePath(f) }))
                .sort((a, b) => a.name.localeCompare(b.name))
            ]) //TODO: add fuzzy  https://github.com/faressoft/inquirer-checkbox-plus-prompt
          }
        }
      ])
      return { destPath: getAbsolutePath(file, options.project) }
    }
  }
}
