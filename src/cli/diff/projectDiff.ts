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
  const allFiles = project.getSourceFiles().map(f => ({
    oldText: readFileSync(f.getFilePath()).toString(),
    newText: f.getFullText(),
    name: getFileRelativePath(f, project)
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

  allFiles.filter(f=>f.newText!==f.oldText).map(file => ({
    name: file.name,
    diff: createPatch(file.name, file.oldText, file.newText)
  }))
    .forEach(f => {
      console.log(`
${f.name}

${colorizeDiff(f.diff)}
    `);

    })

    
}

function colorizeDiff(p: string) {
  return p.split('\n').map(l => l.startsWith('-') ? ansi.format(l, ['red']) : l.startsWith('+') ? ansi.format(l, ['green']) : l).join('\n')
}