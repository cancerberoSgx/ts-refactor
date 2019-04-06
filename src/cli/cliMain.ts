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
ts-refactor organizeImports "./src/**" "./spec/**/*Spec.ts" --dontAsk
ts-refactor moveDeclaration src/foo/model2.ts src/foo/abstract/abstractModels.ts --tsConfigPath ../another/project/tsconfig.json

Tool options:
 --tsConfigPath
 --dontWrite
 --dontConfirm
 --dontAsk
 --help
 --debug

Run ts-refactor --interactiveHelp for more details or see the project's README.
  `)
}

cliMain().catch(error => {
  console.error('Error: ' + error)
  error.stack && console.log(error.stack.split('\n').join('\n'))
  process.exit(1)
})
