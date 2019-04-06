import { ansi } from 'ansi-escape-sequences'
import { prompt, registerPrompt } from 'inquirer'
import { File, Fix, FixOptions } from '../../fix'

registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))

export async function inquireFiles(allFiles: File[], fix: Fix, options: FixOptions): Promise<File[]> {
  // uiLog(`(Move up and down to scroll. Type to filter)`)
  const answers = await prompt<File[]>([
    {
      type: 'checkbox-plus',
      name: 'files',
      message: fix.selectFilesMessage || 'Select files',
      // @ts-ignore
      searchable: true,
      suffix: `${ansi.format(` (Type to filter. `, ['gray'])}${ansi.format('<space>', ['cyan'])}${ansi.format(
        ` to select, `,
        ['gray']
      )}${ansi.format('<enter>', ['cyan'])}${ansi.format(` to end)`, ['gray'])}`,
      highlight: true,
      pageSize: 10,
      // default: [allFiles[0]],
      validate(input: File[], answers) {
        return (fix.verifyInputFiles && fix.verifyInputFiles(input ? input : [], options)) || true
      },
      // @ts-ignore
      source: function(answersSoFar: string[], input: string) {
        // @ts-ignore
        //TODO: add fuzzy  https://github.com/faressoft/inquirer-checkbox-plus-prompt
        return Promise.resolve(
          allFiles
            .filter(f => !f.name.startsWith('..') && f.name.includes(input))
            .map(f => ({ name: f.name.replace(input, `${ansi.format(input, ['green'])}`), value: f }))
        )
      }
    }
  ])
  // if (answers.files.includes('&ALL')) {
  //   answers.files = allFiles
  // }
  return answers.files
}
