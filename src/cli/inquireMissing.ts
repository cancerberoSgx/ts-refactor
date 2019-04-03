import { Project, SourceFile, Directory, IfStatement } from 'ts-morph'
import { FIX, FixOptions, File } from '../fix'
import { getSourceFileRelativePath, getFilePath, isSourceFile } from '../project'
import { ParsedArgs } from '../toolOption'
import { inquireFiles } from './inquire/inquireFiles'
import { inquireFix } from './inquire/inquireFix'
import { notUndefined } from '../misc'
import { getFix } from '../fixes'
import * as match from 'minimatch'

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
  let allFiles: File[] = project
    .getSourceFiles()
    .map(f => ({ name: getSourceFileRelativePath(f, project), isFolder: false, path: getFilePath(f, project) }))
    .concat(
      project
        .getDirectories()
        .map(f => ({ name: getSourceFileRelativePath(f, project), isFolder: true, path: getFilePath(f, project) }))
    )
    .filter(notUndefined)
    .sort((f1, f2) => f1.name.localeCompare(f2.name))

  if (fix && fix.filterInputFiles) {
    allFiles = fix.filterInputFiles!(allFiles)
  }
  if (options.files && options.files.length > 0) {
    inputFileNames = allFiles.filter(f =>
      (options.files || [])
        .map(fileInOptions => (fileInOptions.startsWith('./') ? fileInOptions.substring(2) : fileInOptions))
        .map(fileInOptions =>
          fileInOptions.endsWith('/') ? fileInOptions.substring(0, fileInOptions.length - 1) : fileInOptions
        )
        .find(fileInOptions => {
          return match(f.name, fileInOptions, { dot: true, matchBase: true })
        })
    )
  } else {
    inputFileNames = await inquireFiles(allFiles, fix && fix.selectFilesMessage ? fix.selectFilesMessage!() : undefined)
  }

  options.toolOptions &&
    options.toolOptions.debug &&
    console.log(`Matched files: ${inputFileNames.map(f => f.name).join(', ')}`)

  const inputFiles = inputFileNames
    .map(f => (f.isFolder ? project.getDirectory(f.path) : project.getSourceFile(f.path)))
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
  console.log('inquireMissing files', inputFileNames, inputFiles.map(f => getSourceFileRelativePath(f, project)))
  return outputOptions
}
