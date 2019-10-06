// import { Snippet } from 'enquirer'
// import humanizeString from 'humanize-string'
// import { formatOptions } from '../../fix/formatOptions';
import { prompt } from 'inquirer'
import { AllFormatCodeSettings, allFormatCodeSettingsNames, FixWithFormatCodeSettingOptions } from '../../fix/formatTypes'
/**
 * wil try to read formatCodeSettings.json and if not optionally ask the user to fill them interactively
 */
export async function inquireFormatCodeSettings(
  options: FixWithFormatCodeSettingOptions
): Promise<AllFormatCodeSettings> {

  //   const snippet = new Snippet({
  //     name: 'formatCodeSettings',
  //     message: 'Format settings for generated code',
  //     required: false,
  //     //@ts-ignore
  //     rows: 10,
  //     // limit: 10,
  //     fields: [
  //       {
  //         name: 'test',
  //         message: 'Author Name',
  //         initial: 'foo',
  //         validate(value: string, state: any, item: any, index: number) {
  //           if (item && item.name === 'test' && !['a', 'b'].includes(value)) {
  //             return snippet.styles.danger('Author name must be "a" or "b');
  //           }
  //           return true;
  //         }
  //       }
  //     ],
  //     template: `
  // ${[{ name: 'test' }, ...formatOptions.properties]!.map(n => `${humanizeString(n.name!)}: \${${n.name}}`).join('\n')}
  // `.trim()
  //   });

  //   // const formatCodeSettings = {}
  //   const formatCodeSettings = await snippet.run()
  //   return { ...(options.formatCodeSettings || {}), ...(formatCodeSettings || {}) }

  // .then(answer => console.log('Answer:', answer.result))
  // .catch(console.error);


  // TODO: all properties are represented as booleans but there are some that are numbers or enums. A cheap solution, for example, tabSize?: number, could be creating several properties like tabSize2: boolean, tabSize4: boolean so we can keep using this widget

  const { formatCodeSettings } = options.options.toolOptions.dontAskFormatCodeSettings ? { formatCodeSettings: options.formatCodeSettings || {} } : await prompt<{ formatCodeSettings: AllFormatCodeSettings }>([
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
  return { ...(options.formatCodeSettings || {}), ...(formatCodeSettings || {}) }

  // // TODO: default if none given
}
