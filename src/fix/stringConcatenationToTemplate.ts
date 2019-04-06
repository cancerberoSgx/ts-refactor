import { FIX } from '../fix'
import { SimpleFix, SimpleFixOptions } from './FormatSettingsFix'
import { prompt } from 'inquirer'
import { stringConcatenationsToTemplateExpressions, templatesToStringConcatenations } from 'ts-simple-ast-extra'

interface Options extends SimpleFixOptions {
  mode: 'stringConcatenationToTemplate' | 'templateToStringConcatenation'
}
// TODO: support format code settings for quotes.
class StringConcatenationToTemplate extends SimpleFix<Options> {
  async inquireOptions(options) {
    const superOptions = await super.inquireOptions(options)
    const thisOptions = await prompt<{ mode: 'stringConcatenationToTemplate' | 'templateToStringConcatenation' }>([
      {
        type: 'list',
        name: 'mode',
        message: 'Mode?',
        choices: [
          { name: 'String Concatenations to Template expressions', value: 'stringConcatenationToTemplate' },
          { name: 'Template expressions to String concatenations', value: 'templateToStringConcatenation' }
        ]
      }
    ])
    Object.assign(options, superOptions, thisOptions)
    return { ...superOptions, thisOptions }
  }
}
export const stringConcatenationToTemplateFix = new StringConcatenationToTemplate({
  action(options) {
    if (options.mode === 'stringConcatenationToTemplate') {
      stringConcatenationsToTemplateExpressions(options.file, options.project.getTypeChecker())
    } else {
      templatesToStringConcatenations(options.file) //TODO: config from format settings
    }
  },
  name: FIX.stringConcatenationToTemplate,
  description: `
It will change string concatenations to template expressions or vice versa, in provided files. 
If a directory is provided it will apply the change to all its descendant files.
This is, in general, a safe operation.
  `,
  selectFilesMessage: 'Select files/folders in replace string concatenations to/from template expressions'
})
