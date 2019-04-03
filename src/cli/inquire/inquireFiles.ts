import { prompt, registerPrompt } from 'inquirer'
import { File } from '../../fix'
registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))

export async function inquireFiles(allFiles: File[], message = 'Select files'): Promise<File[]> {
  const answers = await prompt<{ files: string }>([
    {
      type: 'checkbox-plus',
      name: 'files',
      message,
      // @ts-ignore
      searchable: true,
      highlight: true,
      pageSize: 10,
      default: [allFiles[0]],
      // @ts-ignore
      source: function(answersSoFar: string[], input: string) {
        return Promise.resolve([
          { name: 'ALL', value: { name: '&ALL', isFolder: false } },
          ...allFiles.filter(f => f.name.includes(input)).map(f => ({ name: f.name, value: f }))
        ]) //TODO: add fuzzy  https://github.com/faressoft/inquirer-checkbox-plus-prompt
      }
    }
  ])
  if (answers.files.includes('&ALL')) {
    answers.files = allFiles
  }
  return answers.files
}
