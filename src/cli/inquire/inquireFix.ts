import { prompt } from 'inquirer'
import { FIX, fixNames } from '../../fix'

export async function inquireFix(): Promise<FIX> {
  const answers = await prompt<{ fix: FIX|'__exit__' }>({
    name: 'fix',
    type: 'list',
    message: 'Select a code fix',
    choices: fixNames.map(c => ({
      name: c,
      value: c
    })).concat([{name: 'Exit', value: '__exit__'}])
  })
  if(answers.fix==='__exit__'){
    console.log('Bye');    
    process.exit(0)
  }
  return answers.fix as FIX
}
