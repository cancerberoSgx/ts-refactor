function test() {
  const args = require('yargs-parser')(process.argv.slice(2))
  console.log(args)
}
