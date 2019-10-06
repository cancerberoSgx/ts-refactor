import { prompt, registerPrompt } from 'inquirer'
import { AllFormatCodeSettings, allFormatCodeSettingsNames, FixWithFormatCodeSettingOptions } from '../../fix/formatTypes'

// TODO: all properties are represented as booleans but there are some that are numbers or enums. A cheap solution, for example, tabSize?: number, could be creating several properties like tabSize2: boolean, tabSize4: boolean so we can keep using this widget

registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))

/**
 *
 * @param options wil try to read formatCodeSettings.json and if not optionally ask the user to fill them interactively
 */
export async function inquireFormatCodeSettings(
  options: FixWithFormatCodeSettingOptions
): Promise<AllFormatCodeSettings> {
  const { formatCodeSettings } = await prompt<{ formatCodeSettings: AllFormatCodeSettings }>([
    {
      type: 'checkbox-plus',
      name: 'formatCodeSettings',
      message: 'Format settings for generated code',
      searchable: true,
      highlight: true,
      pageSize: 10,
      default: [],
      source: function(answersSoFar: string[], input: string) {
        return Promise.resolve(allFormatCodeSettingsNames.filter(p => p.includes(input)).sort())
      }
    }
  ])
  // TODO: default if none given
  return { ...(options.formatCodeSettings || {}), ...(formatCodeSettings || {}) }
}
