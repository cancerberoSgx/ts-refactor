import { prompt, registerPrompt } from 'inquirer'

registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

export async function inquireFiles(allFiles: string[]): Promise<string[]> {
  const answers = await prompt([
    {
      type: 'autocomplete',
      name: 'files',
      message: 'Select files ',
      // @ts-ignore
      source: function(answersSoFar: string[], input: string) {
        return Promise.resolve(allFiles.filter(f => f.includes(input))) // TODO: first ones starting with
      }
    }
  ])
  return answers.files
}
