import { ansi } from 'cli-driver'
import { prompt } from 'inquirer'
import { FIX } from '../../fix'
import { getFixes } from '../../fixes'
import { ToolOptionName } from '../../toolOption'
import { inquireFix } from './inquireFix'

const ansiEscapes = require('ansi-escapes')

function fix(s: string) {
  return ansi.format(s, ['bold', 'red'])
}
function code(s: string) {
  return '`' + ansi.format(s, ['italic', 'green']) + '`'
}
function helpIntro() {
  return ansi.format(
    `${ansiEscapes.clearTerminal}${ansi.format('Code Fixes Introduction', ['underline', 'bold', 'blue'])}
 
These tools can refactor your TypeScript code in several ways. Although some might only affect a single file, they are applied in the context of a project which is given by ${code(
      './tsconfig.json'
    )} or the ${code(
      '--' + ToolOptionName.tsConfigPath
    )} argument. We can divide the kind of fixes in three or four families:
 
  * ${ansi.format('Organizational Fix', ['underline'])}, like ${fix(FIX.organizeImports)}, ${fix(
      FIX.removeUnused
    )}, ${fix(
      FIX.format
    )} don't have much impact in the code's structure or semantics and will just reorganize it somehow to apply best practices, code styles or change a code pattern with an equivalent one like ${fix(
      FIX.stringTemplate
    )} or ${fix(
      FIX.arrowFunction
    )} which will change all string concatenations with string templates or all function declarations to arrow functions, and both vice versa, respectively. These might imply lots of text changes, but in general they are safe to apply and the code semantics will remain more or less the same.
 
  * ${ansi.format('Problem Fix', ['underline'])}, like ${fix(FIX.missingImports)}, ${fix(
      FIX.implementInterface
    )}, ${fix(FIX.inferFromUsage)}, ${fix(
      FIX.createDeclaration
    )} which only apply to solve a particular compilation error (are useless in source files without that specific problem). For example, ${fix(
      FIX.missingImports
    )} will fix the error "Cannot find name X" when another file exports a declaration with that name, while, ${fix(
      FIX.implementInterface
    )} applies to the error "Class 'C' incorrectly implements interface 'I'.", etc.
 
  * ${ansi.format('Refactor Fix', ['underline'])}, like ${fix(FIX.moveFile)}, ${fix(FIX.moveDeclaration)} or ${fix(
      FIX.rename
    )} that have direct impact on the code's structure and semantics, possibly affecting many files. For example, ${fix(
      FIX.moveFile
    )} will move a file or directory to another folder (and optionally changing its name). This will update all import declarations in other project files that reference it. These kind of fixes requires user input and in general, oppositely to 'Problem Fixes', the project should compile without errors when applying them. Also some they could be somewhat risky, so is advisable to run the tool with ${code(
      '--dontWrite'
    )} argument or commit / backup the project before.
 
`,
    ['gray']
  )
}

function helpGeneralRules() {
  return ansi.format(
    `${ansiEscapes.clearTerminal}${ansi.format('General Rules', ['underline', 'bold', 'blue'])}
 
${ansi.format('Input Files', ['underline'])}. 
 
  * All fixes require one or more input files or directories. 
  * If the fix apply to a single file then if a directory is provided it wil apply to each of its descendant files. 
  * Any Command line argument that contains the character ${code(`/`)} will be considered a file path. 
  * Input files/directories can be provided as absolute paths, paths relative to tsconfig.json (by default ./tsconfig.json) or also as file patterns (globs). If any argument file matches some file in the project, then the tool assumes they are input files and won't ask for them interactively. 
  * Example commands with file paths: 
    * ${code(`ts-refactor "./src/**/*"`)}, 
    * ${code(`ts-refactor ./src/ ./spec/util/**/*Model.ts`)}
 
${ansi.format('Fixes', ['underline'])}
 
  * Any command line argument that is not a file (doesn't contain the character ${code(
    `/`
  )}) will be considered a fix name or fix option. 
  * The first of these arguments will be considered a fix name and the rest the fix options
  * Depending on the fix, some of the files provided as arguments can be considered input files and other fix options. For example, the command ${code(
    `ts-refactor moveFile src/model/foo.ts src/model/abstract/foo.ts`
  )} targets the fox  ${code(`moveFile`)}  which will assume that, if more than one, the last file argument (${code(
      `src/model/abstract/foo.ts`
    )}) is the destination file or folder to which to move the other input files (${code(`src/model/foo.ts`)})
  
${ansi.format('Interaction', ['underline'])}
 
  * If the command arguments doesn't provide all the information required by the fix, it will ask the user for the missing data interactively.
  * Everything is optional, so for example, by just executing ${code(
    `ts-refactor`
  )}, the tool will ask everything to the user interactively
  * If ${code(
    '--' + ToolOptionName.dontAsk
  )} is provided, the tool won't ask anything and if any data is missing in the command line arguments it will fail. This is nice when you want to make sure the tool won't be waiting for user confirmation / input (CI / automatized environments)
  
`,
    ['gray']
  )
}

function helpFixes() {
  return ansi.format(
    `${ansiEscapes.clearTerminal}${ansi.format('Code Fixes Descriptions', ['underline', 'bold', 'blue'])}
 
${getFixes()
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(
    f => `
  * ${fix(f.name)}: ${f.description}
 `
  )
  .join('')}
`,
    ['gray']
  )
}

export async function handleHelpAndExit(answers: { fix: FIX | '__exit__' | '__help__' }) {
  if (answers.fix === '__exit__') {
    console.log('Bye')
    return process.exit(0)
  }
  if (answers.fix === '__help__') {
    const { section } = await prompt<{ section: any }>({
      name: 'section',
      type: 'list',
      message: 'Select a Topic',
      choices: [
        { name: 'Go Back', value: 'back' },
        { name: 'Introduction', value: 'intro' },
        { name: 'General Rules', value: 'general' },
        { name: 'Fix Descriptions', value: 'fixes' }
      ]
    })

    if (section === 'intro') {
      await prompt([
        {
          name: 'help',
          message: 'Go back',
          type: 'confirm',
          prefix: helpIntro()
        }
      ])
      return await inquireFix()
    }
    if (section === 'general') {
      await prompt([
        {
          name: 'help',
          message: 'Go back',
          type: 'confirm',
          prefix: helpGeneralRules()
        }
      ])
      return await inquireFix()
    }
    if (section === 'fixes') {
      await prompt([
        {
          name: 'help',
          message: 'Go back',
          type: 'confirm',
          prefix: helpFixes()
        }
      ])
      return await inquireFix()
    }

    if (section === 'back') {
      return await inquireFix()
    }
  }
}
