import { ParsedArgs } from './toolOption'
import { Project } from 'ts-morph'
import { buildProject } from './project'
import { inquireMissing } from './cli/inquireMissing'
import { fixes } from './fix'

export async function main(args: Partial<ParsedArgs>) {
  const tsConfigFilePath = args.toolOptions.tsConfigPath || './tsconfig.json'
  const project = buildProject({ tsConfigFilePath })
  const options = await inquireMissing(args, project)
  const fix = fixes.find(f => f.name === options.fix)
  if (!fix) {
    throw `Sorry, the fix ${fix.name} is not supported yet.`
  }
  fix.fn({ ...options, project })
  console.log(options)
}
