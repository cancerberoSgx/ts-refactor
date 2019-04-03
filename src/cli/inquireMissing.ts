// import { CATEGORY } from '../category'
import { FIX } from '../fix'
import { ToolOptions, ParsedArgs } from '../toolOption'
// import { inquireCategory } from './inquire/inquireCategory'
import { inquireFix } from './inquire/inquireFix'
import { Project } from 'ts-morph'
import { inquireFiles } from './inquire/inquireFiles'
import { pwd } from 'shelljs'
import { relative } from 'path'

export async function inquireMissing(options: Partial<ParsedArgs>, project: Project): Promise<ParsedArgs> {
  // let category: CATEGORY
  let fix: FIX
  let files: string[] = []
  let toolOptions: ToolOptions = {}
  // if (!options.category) {
  //   category = await inquireCategory()
  // }
  if (!options.fix) {
    fix = await inquireFix()
  }
  if (options.files.length === 0) {
    // const base = project.createSourceFile('__dummy_base__.ts')
    const rootDir = project.getRootDirectories()[0]
    // const relativeTo = project.getCompilerOptions().rootDir options.toolOptions && options.toolOptions.tsConfigPath || './tsconfig.json'
    const allFiles = project.getSourceFiles().map(f => rootDir.getRelativePathTo(f))
    files = await inquireFiles(allFiles)
  }
  return {
    // category,
    fix,
    files,
    toolOptions
  }
}
