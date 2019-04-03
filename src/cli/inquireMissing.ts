import { Project, SourceFile, Directory, IfStatement } from 'ts-morph'
import { FIX, FixOptions, File } from '../fix'
import { getFileRelativePath, getFilePath, isSourceFile } from '../project'
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
  let inputFileRepresentations: File[]
  if (!options.fix) {
    fixName = await inquireFix()
  } else {
    fixName = options.fix
  }
  const fix = getFix(fixName)
  if (!fix) {
    throw `Sorry, the fix ${fixName} is not supported yet.`
  }

  let allFiles: File[] = project
    .getSourceFiles()
    .map(f => ({ name: getFileRelativePath(f, project), isFolder: false, path: getFilePath(f) }))
    .concat(
      project
        .getDirectories()
        .map(f => ({ name: getFileRelativePath(f, project), isFolder: true, path: getFilePath(f) }))
    )
    .filter(notUndefined)
    .sort((f1, f2) => f1.name.localeCompare(f2.name))

  // if (fix && fix.extractInputFiles) {
  //   allFiles = fix.extractInputFiles!(allFiles)
  // }
  if (options.files && options.files.length > 0) {
    inputFileRepresentations = allFiles.filter(f =>
      (options.files || [])
        .map(fileInOptions => (fileInOptions.startsWith('./') ? fileInOptions.substring(2) : fileInOptions))
        .map(fileInOptions =>
          fileInOptions.endsWith('/') ? fileInOptions.substring(0, fileInOptions.length - 1) : fileInOptions
        )
        .find(fileInOptions => match(f.name, fileInOptions, { dot: true, matchBase: true }))
    )
  } else {
    inputFileRepresentations = await inquireFiles(
      allFiles,
      fix,
      project
      // fix && fix.selectFilesMessage ? fix.selectFilesMessage!() : undefined
    )
  }
  options.toolOptions &&
    options.toolOptions.debug &&
    console.log(`Matched files: ${inputFileRepresentations.map(f => f.name).join(', ')}`)
  inputFileRepresentations = fix.extractInputFiles
    ? fix.extractInputFiles(
        inputFileRepresentations,
        {
          inputFiles: [],
          project
        },
        options
      )
    : inputFileRepresentations

  const inputFiles = inputFileRepresentations
    .map(f => (f.isFolder ? project.getDirectory(f.path) : project.getSourceFile(f.path)))
    .filter(notUndefined)

  let outputOptions: FixOptions & { fixName: FIX } = {
    fixName,
    inputFiles,
    project
  }
  if (fix.inquireOptions) {
    const extraOptions = await fix.inquireOptions(outputOptions, options)
    outputOptions = { ...outputOptions, ...(extraOptions || {}) }
  }
  // if (fix && fix.getValidNodes) {
  //   outputOptions.nodes = inputFiles
  //     .filter(isSourceFile)
  //     .map(f => fix.getValidNodes!(f, outputOptions))
  //     .flat()
  // }
  return outputOptions
}
