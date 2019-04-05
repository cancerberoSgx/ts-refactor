import { Project } from 'ts-morph'
import { readFileSync } from 'fs';
import { prompt, registerPrompt } from 'inquirer'
import { getFileRelativePath } from '../../project';
import { createPatch } from 'diff'
import { ansi } from 'cli-driver'

// interface File {
//   name: string
//   oldText: string
//   newText: string
// }

registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))

export async function showProjectDiff(project: Project) {
  const allFiles = project.getSourceFiles()
  .map(f => ({
    oldText: readFileSync(f.getFilePath()).toString(),
    newText: f.getFullText(),
    name: getFileRelativePath(f, project)
  }))
  .filter(f=>f.newText!==f.oldText)
  .map(file => ({
    name: file.name,
    diff: createPatch(file.name, file.oldText, file.newText)
  }))
  
  // const {files} = await prompt<File[]>([{
  //   type: 'checkbox-plus',
  //   name: 'files',
  //   message: 'Select files to diff',
  //   //@ts-ignore
  //   source: function (answersSoFar: string[], input: string) {
  //     //TODO: add fuzzy  https://github.com/faressoft/inquirer-checkbox-plus-prompt
  //     return Promise.resolve(
  //       allFiles.map(f => ({ name: f.name, value: f }))
  //     )
  //   }
  // }])

  // allFiles.)
  // allFiles.forEach(f => {
//       console.log(`
// ${f.name}

// ${colorizeDiff(f.diff)}
//     `);

//     })

let answer = {selection: {}}
while(answer.selection!=='__goBack__'){
  answer = await prompt<{selection: string|{name:string, diff: string}}>([{
    type: 'list',name: 'selection', message: 'Choose a file to see its diff', choices: [
      {name: 'Go back', value: '__goBack__'}, ...allFiles.map(f=>({name: f.name, value: f}))
    ]
  }])
  if(answer.selection!=='__goBack__'){
    showDiff(answer.selection as any as {name:string, diff: string})
  }
}
    
}
function showDiff(f: {name:string, diff: string}){
  console.log(`${colorizeDiff(f.diff)}`);
}

// async function selectFiles(allFiles: {name:string, diff: string}[]){
//   let answer = {selection: {}}
//   while(answer.selection!=='__goBack__'){
//     answer = await prompt<{selection: string|{name:string, diff: string}}>([{
//       type: 'list',name: 'selection', message: 'Choose a file to see its diff', choices: [
//         {name: 'Go back', value: '__goBack__'}, ...allFiles.map(f=>({name: f.name, value: f}))
//       ]
//     }])
//     if(answer.selection!=='__goBack__'){
//       showDiff(answer.selection as any as {name:string, diff: string})
//     }
//   }
// }
function colorizeDiff(p: string) {
  return p.split('\n').map(l => l.startsWith('-') ? ansi.format(l, ['red']) : l.startsWith('+') ? ansi.format(l, ['green']) : l).join('\n')
}