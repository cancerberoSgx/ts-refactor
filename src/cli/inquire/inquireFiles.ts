import { prompt, registerPrompt } from 'inquirer'

registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))

export async function inquireFiles(allFiles: string[]): Promise<string[]> {
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
          { name: 'ALL', value: '&ALL' },
          ...allFiles.filter(f => f.includes(input)).map(f => ({ name: f, value: f }))
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
