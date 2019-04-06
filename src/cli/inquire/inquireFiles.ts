import { prompt, registerPrompt } from 'inquirer'
import { Project } from 'ts-morph'
import { File, Fix, FixOptions } from '../../fix'

registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))

export async function inquireFiles(allFiles: File[], fix: Fix, options: FixOptions): Promise<File[]> {
  const answers = await prompt<File[]>([
    {
      type: 'checkbox-plus',
      name: 'files',
      message: fix.selectFilesMessage || 'Select files',
      // @ts-ignore
      searchable: true,
      highlight: true,
      pageSize: 10,
      default: [allFiles[0]],
      validate(input, answers) {
        return (fix.verifyInputFiles && fix.verifyInputFiles(answers ? answers : [], options)) || true
      },
      // @ts-ignore
      source: function(answersSoFar: string[], input: string) {
        //TODO: add fuzzy  https://github.com/faressoft/inquirer-checkbox-plus-prompt
        return Promise.resolve(
          allFiles
            .filter(f => !f.name.startsWith('..') && f.name.includes(input))
            .map(f => ({ name: f.name, value: f }))
        )
      }
    }
  ])
  if (answers.files.includes('&ALL')) {
    answers.files = allFiles
  }
  return answers.files
}
