
// import {  prompt} from 'inquirer'
// import *  as ansi from 'ansi-escape-sequences'
// async function hackInquirerConfig() {
//   const ansiEscapes = require('ansi-escapes');
//   // Moves the cursor two rows up and to the left
//   // process.stdout.write(ansiEscapes.cursorUp(2) + ansiEscapes.cursorLeft);
//   const p = prompt([]);
//   //@ts-ignore
//   const originalOnKeyPress = p.ui.prompts.confirm.prototype.onKeypress;
//   //@ts-ignore
//   p.ui.prompts.confirm.prototype.onKeypress = function (e: any) {
//     // console.log(key);
//     if (e.key.name === 'down') {
//       // process.stdout.write(ansiEscapes.cursorUp(10))
//       // process.stdout.write(ansiEscapes.scrollUp)
//       process.stdout.write(ansiEscapes.cursorNextLine);
//     }
//     else if (e.key.name === 'up') {
//       // process.stdout.write(ansiEscapes.scrollDown)
//       // process.stdout.write(ansiEscapes.cursorDown(10))
//       process.stdout.write(ansiEscapes.cursorPrevLine);
//     }
//     else {
//       return originalOnKeyPress.apply(this, arguments);
//     }
//   };
//   await p;
// }

