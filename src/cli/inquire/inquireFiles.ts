import { prompt, registerPrompt } from 'inquirer'

// registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

export async function inquireFiles(allFiles: string[]): Promise<string[]> {
  const answers = await prompt([
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
        return Promise.resolve(allFiles.filter(f => f.includes(input))) // TODO: first ones starting with
      }
    }
  ])
  return answers.files
}
