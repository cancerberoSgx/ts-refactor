import { Project, SourceFile, Directory } from 'ts-morph'
import { FIX, FixOptions, File } from '../fix'
import { getSourceFileRelativePath } from '../project'
import { ParsedArgs } from '../toolOption'
import { inquireFiles } from './inquire/inquireFiles'
import { inquireFix } from './inquire/inquireFix'
import { notUndefined } from '../misc'
import { getFix } from '../fixes'
import { isSourceFile } from '../fix/organizeImports'

export async function inquireMissing(
  options: Partial<ParsedArgs>,
  project: Project
): Promise<FixOptions & { fixName: FIX }> {
  let fixName: FIX
  let inputFileNames: File[] = []
  if (!options.fix) {
    fixName = await inquireFix()
  } else {
    fixName = options.fix
  }
  const fix = getFix(fixName)
  if (!options.files || options.files.length === 0) {
    let allFiles = project
      .getSourceFiles()
      .map(f => ({ name: getSourceFileRelativePath(f, project), isFolder: false }))
      .concat(project.getDirectories().map(f => ({ name: getSourceFileRelativePath(f, project), isFolder: true })))
    if (fix && fix.filterInputFiles) {
      allFiles = fix.filterInputFiles!(allFiles)
    }
    inputFileNames = await inquireFiles(allFiles)
  }
  const inputFiles = inputFileNames
    .map(f => (f.isFolder ? project.getDirectory(f.name) : project.getSourceFile(f.name)))
    .filter(notUndefined)

  const outputOptions: FixOptions & { fixName: FIX } = {
    fixName,
    inputFiles,
    project
  }

  if (fix && fix.getValidNodes) {
    outputOptions.nodes = inputFiles
      .filter(isSourceFile)
      .map(f => fix.getValidNodes!(f, outputOptions))
      .flat()
  }
  return outputOptions
}
