import { prompt } from 'inquirer'
import { FIX, fixNames } from '../../fix'

export async function inquireFix(): Promise<FIX> {
  const answers = await prompt<{ fix: FIX }>({
    name: 'fix',
    type: 'list',
    message: 'Which fix?',
    choices: fixNames.map(c => ({
      name: c,
      value: c
    }))
  })
  //TODO: verify its FIX?
  return answers.fix
}
