import { prompt, registerPrompt } from 'inquirer'
import { File } from '../../fix'
import { FormatCodeSettings, formatCodeSettingsNames } from '../../fix/formatTypes'

registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))

export async function inquireFormatCodeSettings(): Promise<File[]> {
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
