import { main } from '../main'
import { parseArgs, RawArgs } from './parseArgs'

async function cliMain() {
  const args = require('yargs-parser')(process.argv.slice(2)) as RawArgs
  const options = parseArgs(args)
  if (options.toolOptions && options.toolOptions.help) {
    printHelp()
    process.exit(0)
  }
  await main(options)
}

function printHelp() {
  console.log(`
Usage: ts-refactor fixName [...fixOptions] ...inputFiles

Usage Examples: 
ts-refactor organizeImports ./src/ --noInteractive # all information given
tsconfig # will be asked for a fix, options and input files

Tool options:
 --noInteractive
 --tsConfigPath
 --dontWrite
 --dontConfirm
 --help
 --debug

Fixes:
  * organizeImports
    · no options required, only some input files or folders

  `)
}

cliMain().catch(error => {
  console.error('Error: ' + error)
  error.stack && console.log(error.stack.split('\n').join('\n'))
  process.exit(1)
})
