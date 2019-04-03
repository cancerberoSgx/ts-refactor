import { ParsedArgs } from './toolOption'
import { Project } from 'ts-morph'
import { buildProject, checkFilesInProject } from './project'
import { inquireMissing } from './cli/inquireMissing'
import { resolve } from 'path'
import { getFix } from './fixes'

export async function main(args: Partial<ParsedArgs>) {
  const tsConfigFilePath = (args.toolOptions && args.toolOptions.tsConfigPath) || './tsconfig.json'
  const project = buildProject({ tsConfigFilePath })
  const options = await inquireMissing(args, project)
  // console.log(options.fixName, options.inputFiles.map(f => f.getFilePath()))

  checkFilesInProject(options.inputFiles, project)

  const fix = getFix(options.fixName)

  // console.log(options);

  if (!fix) {
    throw `Sorry, the fix ${options.fixName} is not supported yet.`
  }

  fix.fn({ ...options, project })
  // console.log(options)
}
