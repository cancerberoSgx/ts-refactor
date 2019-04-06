import { prompt } from 'inquirer';
import { FIX, fixNames } from '../../fix';
import { handleHelpAndExit } from './help';

export async function inquireFix(): Promise<FIX | '__help__' | '__exit__'> {
  const answers = await prompt<{ fix: FIX | '__exit__' | '__help__' }>({
    name: 'fix',
    type: 'list',
    message: 'Select a code fix',
    choices: [{ name: 'Help', value: '__help__' }]
      .concat(
        fixNames.map(c => ({
          name: c,
          value: c
        }))
      )
      .concat([{ name: 'Exit', value: '__exit__' }])
  })
  await handleHelpAndExit(answers)
  return answers.fix as FIX
}
