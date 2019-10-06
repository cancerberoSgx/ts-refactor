import * as ansi from 'ansi-escape-sequences'
import { prompt } from 'inquirer'
import { File, Fix, FixOptions } from '../../fix'

export async function inquireFiles(allFiles: File[], fix: Fix, options: FixOptions): Promise<File[]> {
  const answers = await prompt<{ files: File[] }>([
    {
      type: 'checkbox-plus',
      name: 'files',
      message: fix.selectFilesMessage || 'Select files',
      searchable: true,
      suffix: `${ansi.format(` (Type to filter. `, ['gray'])}${ansi.format('<space>', ['cyan'])}${ansi.format(
        ` to select, `,
        ['gray']
      )}${ansi.format('<enter>', ['cyan'])}${ansi.format(` to end)`, ['gray'])}`,
      highlight: true,
      pageSize: 10,
      validate(input: File[], answers) {
        return (fix.verifyInputFiles && fix.verifyInputFiles(input ? input : [], options)) || true
      },
      source: function(answersSoFar: string[], input: string) {
        return Promise.resolve(
          allFiles
            .filter(f => !f.name.startsWith('..') && f.name.includes(input))
            .map(f => ({ name: f.name.replace(input, `${ansi.format(input, ['green'])}`), value: f }))
        )
      }
    }
  ])
  return answers.files || []
}
