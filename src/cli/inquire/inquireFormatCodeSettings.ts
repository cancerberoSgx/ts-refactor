import { prompt, registerPrompt } from 'inquirer'
import { File, FixOptions } from '../../fix'
import { FormatCodeSettings, formatCodeSettingsNames } from '../../fix/formatTypes'
// import { uiLog } from './inquireLogger'

// TODO: all properties are represented as booleans but there are some that are numbers or enums. A cheap solution, for example, tabSize?: number, could be creating several properties like tabSize2: boolean, tabSize4: boolean so we can keep using this widget

registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))

export async function inquireFormatCodeSettings(options: FixOptions): Promise<File[]> {
  // uiLog(
  //   options.project.manipulationSettings.getEditorSettings(),
  //   options.project.manipulationSettings.getFormatCodeSettings()
  // )
  const answers = await prompt<{ formatCodeSettings: FormatCodeSettings }>([
    {
      type: 'checkbox-plus',
      name: 'formatCodeSettings',
      message: 'Format settings for generated code',
      // @ts-ignore
      searchable: true,
      highlight: true,
      pageSize: 10,
      default: [],
      // @ts-ignore
      source: function(answersSoFar: string[], input: string) {
        return Promise.resolve(formatCodeSettingsNames.filter(p => p.includes(input)).sort())
      }
    }
  ])
  return answers.files
}
