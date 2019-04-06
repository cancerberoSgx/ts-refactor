import { readFileSync } from 'fs';
import { prompt, registerPrompt } from 'inquirer';
import { FixWithFormatCodeSettingOptions, FormatCodeSettings, formatCodeSettingsNames } from '../../fix/formatTypes';

// TODO: all properties are represented as booleans but there are some that are numbers or enums. A cheap solution, for example, tabSize?: number, could be creating several properties like tabSize2: boolean, tabSize4: boolean so we can keep using this widget

registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))
/**
 * 
 * @param options wil try to read formatCodeSettings.json and if not optionally ask the user to fill them interactively
 */
export async function inquireFormatCodeSettings(options: FixWithFormatCodeSettingOptions): Promise<FormatCodeSettings> {
  let formatCodeSettings: FormatCodeSettings = {}
  const formatSettingsFile = (options.options.files||[]).find(f=>f.endsWith('formatCodeSettings.json'))
  if(formatSettingsFile) {
    try {
      formatCodeSettings = JSON.parse(readFileSync(formatSettingsFile).toString())
    } catch (error) {
      throw new Error(`Failed to parse given ${formatSettingsFile} file. Error: ${error}`)
    }
  }
  if(!formatCodeSettings){
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
    formatCodeSettings = answers.formatCodeSettings
  }
  // TODO: default if none given  
  return {...options.formatCodeSettings||{}, ...formatCodeSettings||{}}
}
