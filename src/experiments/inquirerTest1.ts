// import * as inquirer from 'inquirer'
// // import { categories } from '../category'
// import { ls } from 'shelljs'
// async function test() {
//   // const answer = await askCategory()
//   // console.log(answer)

//   const files = ls('-R', '.').map(f => f.toString())
//   inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
//   ;(inquirer.prompt as any)([
//     {
//       type: 'autocomplete',
//       name: 'from',
//       message: 'Select a state to travel from',
//       source: function(answersSoFar: string[], input: string) {
//         return Promise.resolve(files.filter(f => f.includes(input)))
//       }
//     }
//   ]).then(function(answers) {
//     //etc
//     console.log(answers)
//   })
// }

// test()

// // async function askCategory() {
// //   return await inquirer.prompt({
// //     name: 'category',
// //     type: 'list',
// //     message: 'Which kind of fix?',
// //     choices: categories.map(c => ({
// //       name: c,
// //       value: c
// //     }))
// //   })
// // }
