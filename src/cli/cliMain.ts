import { RawArgs, parseArgs } from './parseArgs'
import { main } from '../main'

async function cliMain() {
  const args = require('yargs-parser')(process.argv.slice(2)) as RawArgs
  const options = parseArgs(args)
  if (options.toolOptions && options.toolOptions.help) {
    printHelp()
    process.exit(0)
  }
  const result = await main(options)
}

function printHelp() {
  console.log(`
Usage: tstool fixName [...fixOptions] ...inputFiles

Usage Examples: 
tstool organizeImports ./src/ --noInteractive # all information given
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

cliMain()
  .then(() => {})
  .catch(error => {
    console.error('Error: ' + error)
    process.exit(1)
  })
