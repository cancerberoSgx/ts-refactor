import { ParsedArgs } from './toolOption'
import { Project } from 'ts-morph'
import { buildProject, checkFilesInProject, getFileRelativePath } from './project'
import { inquireMissing } from './cli/inquireMissing'
import { resolve } from 'path'
import { getFix } from './fixes'
import { prompt } from 'inquirer'

export async function main(args: Partial<ParsedArgs>) {
  const tsConfigFilePath = (args.toolOptions && args.toolOptions.tsConfigPath) || './tsconfig.json'
  const project = buildProject({ tsConfigFilePath })
  const options = await inquireMissing(args, project)

  checkFilesInProject(options.inputFiles, project)

  const fix = getFix(options.fixName)! //checked at requireMissing

  const result = fix.fn({ ...options, project })

  if (result.files.length === 0) {
    throw 'No input files were found. Aborting. '
  }
  let confirmed = false
  if (!args.toolOptions || !args.toolOptions!.dontWrite) {
    if (!args.toolOptions || !args.toolOptions!.dontConfirm) {
      const confirmedAnswer = await prompt<{ confirmed: boolean }>([
        {
          type: 'confirm',
          prefix: `The following (${result.files.length}) files will be modified:\n${result.files
            .map(f => f.name)
            .join(', ')}\n`,
          message: `Are you sure you want to continue?`,
          name: 'confirmed'
        }
      ])
      confirmed = confirmedAnswer.confirmed
      if (!confirmed) {
        console.log('Skip writing files')
      }
    } else {
      confirmed = true
    }
  }
  if (confirmed) {
    project.saveSync()
    console.log(`Finished writing (${result.files.length}) files.`)
  }
}
