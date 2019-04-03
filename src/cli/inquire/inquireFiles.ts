import { prompt, registerPrompt } from 'inquirer'
import { File } from '../../fix'

registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))

export async function inquireFiles(allFiles: File[]): Promise<File[]> {
  const answers = await prompt<{ files: string }>([
    {
      type: 'checkbox-plus',
      name: 'files',
      message: 'Select files ',
      // @ts-ignore
      searchable: true,
      highlight: true,
      pageSize: 10,
      default: [allFiles[0]],
      // @ts-ignore
      source: function(answersSoFar: string[], input: string) {
        return Promise.resolve([
          { name: 'ALL', value: { name: '&ALL', isFolder: false } },
          ...allFiles
            .map(f => f.name)
            .filter(f => f.includes(input))
            .map(f => ({ name: f, value: f }))
        ]) //TODO: add fuzzy  https://github.com/faressoft/inquirer-checkbox-plus-prompt
      }
    }
  ])
  console.log(answers)

  if (answers.files.includes('&ALL')) {
    answers.files = allFiles
    console.log(answers)
  }

  return answers.files
}
