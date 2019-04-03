import { RawArgs, parseArgs } from './parseArgs'
import { main } from '../main'

async function cliMain() {
  const args = require('yargs-parser')(process.argv.slice(2)) as RawArgs
  const options = parseArgs(args)
  const result = await main(options)
}

;(async () => {
  await cliMain()
})()
