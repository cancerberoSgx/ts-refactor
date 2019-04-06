import * as match from 'minimatch'
import { Project } from 'ts-morph'
import { File, FIX, FixOptions } from '../fix'
import { getFix } from '../fixes'
import { notUndefined } from '../misc'
import { getFilePath, getFileRelativePath } from '../project'
import { ParsedArgs } from '../toolOption'
import { inquireFiles } from './inquire/inquireFiles'
import { inquireFix } from './inquire/inquireFix'

export async function inquireMissing(
  options: Partial<ParsedArgs>,
  project: Project
): Promise<FixOptions & { fixName: FIX }> {

  // await hackInquirerConfig();

  let fixName: FIX
  let inputFileRepresentations: File[]
  if (!options.fix) {
    fixName = (await inquireFix()) as FIX
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
    inputFileRepresentations = await inquireFiles(allFiles, fix, { project, inputFiles: [], options })
  }
  options.toolOptions &&
    options.toolOptions.debug &&
    console.log(`Matched files: ${inputFileRepresentations.map(f => f.name).join(', ')}`)
  inputFileRepresentations = fix.extractInputFiles
    ? fix.extractInputFiles(
        inputFileRepresentations,
        {
          inputFiles: [],
          project,
          options
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
    project,
    options
  }
  if (fix.inquireOptions) {
    const extraOptions = await fix.inquireOptions(outputOptions, options)
    outputOptions = { ...outputOptions, ...(extraOptions || {}) }
  }
  return outputOptions
}