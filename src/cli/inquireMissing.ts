import { Project } from 'ts-morph'
import { FIX, FixOptions } from '../fix'
import { getSourceFileRelativePath } from '../project'
import { ParsedArgs } from '../toolOption'
import { inquireFiles } from './inquire/inquireFiles'
import { inquireFix } from './inquire/inquireFix'
import { notUndefined } from '../misc'

export async function inquireMissing(
  options: Partial<ParsedArgs>,
  project: Project
): Promise<FixOptions & { fixName: FIX }> {
  let fix: FIX
  let inputFileNames: string[] = []
  if (!options.fix) {
    fix = await inquireFix()
  }
  if (!options.files || options.files.length === 0) {
    const allFiles = project.getSourceFiles().map(f => getSourceFileRelativePath(f, project))
    inputFileNames = await inquireFiles(allFiles)
  }
  const inputFiles = inputFileNames.map(f => project.getSourceFile(f)).filter(notUndefined)
  return {
    fixName: fix!,
    inputFiles: inputFiles,
    project
  }
}
