import { prompt } from 'inquirer'
import { handleHelpAndExit } from './cli/inquire/help'
import { uiLog, uiLogClose } from './cli/inquire/inquireLogger'
import { inquireMissing } from './cli/inquireMissing'
import { showProjectDiff } from './cli/projectDiff'
import { getFix } from './fix/fixes'
import { buildProject, checkFilesInProject } from './project'
import { ParsedArgs } from './toolOption'

export async function main(args: Partial<ParsedArgs>) {
  if (args.toolOptions && args.toolOptions.interactiveHelp) {
    await handleHelpAndExit({ fix: '__help__', goBackMode: 'exit' })
    return process.exit(0)
  }
  const tsConfigFilePath = (args.toolOptions && args.toolOptions.tsConfigPath) || './tsconfig.json'
  const project = buildProject({ tsConfigFilePath })
  const options = await inquireMissing(args, project)
  await uiLog('Working...')
  // await sleep(4000)
  checkFilesInProject(options.inputFiles, project)
  const fix = getFix(options.fixName)! //checked at requireMissing
  const result = fix.fn({ ...options, project })
  if (result.files.length === 0) {
    throw 'No input files were found. Aborting. '
  }
  let confirmed = false
  if (!args.toolOptions || !args.toolOptions!.dontWrite) {
    if (!args.toolOptions || (!args.toolOptions!.dontConfirm && !args.toolOptions!.dontAsk)) {
      const { proceed } = await prompt<{ proceed: 'continue' | 'cancel' | 'diff' }>([
        {
          type: 'list',
          prefix: `The following (${result.files.length}) files will be modified:\n${result.files
            .map(f => f.name)
            .join(', ')}\n`,
          message: `Are you sure you want to continue?`,
          choices: [
            { name: 'Yes, proceed writing files.', value: 'continue' },
            { name: `No, cancel the operation.`, value: 'cancel' },
            { name: `Show me a diff of modified files first`, value: 'diff' }
          ],
          name: 'proceed'
        }
      ])
      if (proceed === 'diff') {
        await showProjectDiff(project)
        const { proceed } = await prompt<{ proceed: boolean }>([
          {
            type: 'confirm',
            name: 'proceed',
            message: 'Do you want to proceed?'
          }
        ])
        if (proceed) {
          confirmed = true
        }
      } else if (proceed === 'continue') {
        confirmed = true
      }
    } else {
      confirmed = true
    }
  }
  if (confirmed) {
    project.saveSync()
    console.log(`Finished writing (${result.files.length}) files.`)
  } else {
    console.log('Skip writing files.')
  }
  uiLogClose()
}
