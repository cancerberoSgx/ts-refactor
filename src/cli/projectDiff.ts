import * as ansi from 'ansi-escape-sequences'
import { createPatch } from 'diff'
import { readFileSync } from 'fs'
import { prompt } from 'inquirer'
import { Project } from 'ts-morph'
import { getFileRelativePath } from '../project'

export async function showProjectDiff(project: Project) {
  const allFiles = project
    .getSourceFiles()
    .map(f => ({
      oldText: readFileSync(f.getFilePath()).toString(),
      newText: f.getFullText(),
      name: getFileRelativePath(f, project)
    }))
    .filter(f => f.newText !== f.oldText)
    .map(file => ({
      name: file.name,
      diff: createPatch(file.name, file.oldText, file.newText)
    }))
  let answer = { selection: {} }
  while (answer.selection !== '__goBack__') {
    answer = await prompt<{ selection: string | { name: string; diff: string } }>([
      {
        type: 'list',
        name: 'selection',
        message: 'Choose a file to see its diff',
        choices: [{ name: 'Go back', value: '__goBack__' }, ...allFiles.map(f => ({ name: f.name, value: f }))]
      }
    ])
    if (answer.selection !== '__goBack__') {
      showDiff((answer.selection as any) as { name: string; diff: string })
    }
  }
}

function showDiff(f: { name: string; diff: string }) {
  const colorized = f.diff
    .split('\n')
    .map(l => (l.startsWith('-') ? ansi.format(l, ['red']) : l.startsWith('+') ? ansi.format(l, ['green']) : l))
    .join('\n')
  console.log(`${colorized}`)
}
