import { prompt } from 'inquirer'
import { stringConcatenationsToTemplateExpressions, templatesToStringConcatenations } from 'ts-simple-ast-extra'
import { code } from '../cli/inquire/ansiStyle'
import { FIX } from '../fix'
import { ToolOptionName } from '../toolOption'
import { FormatSettingsFix, SimpleFixConstructorActionOptions } from './abstract/formatSettingsFix'

interface Options extends SimpleFixConstructorActionOptions {
  mode: 'stringConcatenationToTemplate' | 'templateToStringConcatenation'
}
// TODO: support format code settings for quotes.
class StringConcatenationToTemplate extends FormatSettingsFix<Options> {
  async inquireOptions(options: Options) {
    const superOptions = await super.inquireOptions(options)
    let thisOptions: { mode: 'stringConcatenationToTemplate' | 'templateToStringConcatenation' } = {
      mode: 'stringConcatenationToTemplate'
    }
    const mode: 'stringConcatenationToTemplate' | 'templateToStringConcatenation' | undefined = (
      options.options.fixOptions || []
    ).find(m => ['stringConcatenationToTemplate', 'templateToStringConcatenation'].includes(m)) as
      | 'stringConcatenationToTemplate'
      | 'templateToStringConcatenation'
      | undefined
    if (mode) {
      thisOptions = { mode }
    } else {
      thisOptions = await prompt<Options>([
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
    }
    Object.assign(options, superOptions, thisOptions)
    return { ...superOptions, thisOptions }
  }
  description = `
It will change string concatenations to template expressions or vice versa, in provided files. 
If a directory is provided it will apply the change to all its descendant files.
This is, in general, a safe operation.
Example mofiying several files non interactively:
  ${code(
    `npx ts-node src/cli/cliMain.ts ${FIX.stringTemplate} stringConcatenationToTemplate "./src/**/*string_*.ts*" --${
      ToolOptionName.dontAsk
    }`
  )}
TODO: Support FormatCodeSettings and UserPreferences
WARNING: Although it should be relative safe to use, verify the changes and backup/commit your files before saving the changes.
  `
  _selectFilesMessage = 'Select files/folders in replace string concatenations to/from template expressions'
}
export const stringConcatenationToTemplateFix = new StringConcatenationToTemplate({
  action(options) {
    if (options.mode === 'stringConcatenationToTemplate') {
      stringConcatenationsToTemplateExpressions(options.file, options.project.getTypeChecker())
    } else {
      templatesToStringConcatenations(options.file) //TODO: config from format settings
    }
  },
  name: FIX.stringTemplate
})
