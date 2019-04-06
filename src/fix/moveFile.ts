import { prompt, registerPrompt } from 'inquirer'
import { FIX, Fix, FixOptions, FixResult } from '../fix'
import { getAbsolutePath, getFileFromRelativePath, getFilePath, getFileRelativePath, isSourceFile } from '../project'
import { uiLog } from '../cli/inquire/inquireLogger'

interface MoveFileOptions extends FixOptions {
  destPath: string
}

function moveFile(options: MoveFileOptions) {
  const t0 = Date.now()
  const { project } = options
  const result: FixResult = { files: [] }
  if (options.inputFiles.length === 0) {
    throw 'No files or folder given'
  }
  const destPathIsFile = options.destPath.lastIndexOf('.') > options.destPath.lastIndexOf('/')
  let dir = project.getDirectory(options.destPath)
  const sourceFile = project.getSourceFile(options.destPath)
  if (sourceFile) {
    throw `A source file with path ${options.destPath} already exists. Refusing to move something at that location. `
  } else if ((!dir && destPathIsFile && options.inputFiles.length !== 1) || !isSourceFile(options.inputFiles[0])) {
    throw `Refusing to a folder or move several files to a destination path that looks like a file (${
      options.destPath
    } has an extension)`
  } else if ((!dir && destPathIsFile) || (options.inputFiles.length === 1 && !isSourceFile(options.inputFiles[0]))) {
    const t0 = Date.now()
    const oldPath = getFileRelativePath(options.inputFiles[0]!, project)
    const newFile = options.inputFiles[0].move(options.destPath, { overwrite: false })
    result.files.push({ name: getFileRelativePath(newFile, project), time: Date.now() - t0 })
    result.files.push({ name: oldPath, time: Date.now() - t0 })
  } else {
    if (!dir) {
      const t0 = Date.now()
      dir = project.createDirectory(options.destPath)
      result.files.push({ name: getFileRelativePath(dir, project), time: Date.now() - t0 })
    }
    options.inputFiles.forEach(file => {
      const t0 = Date.now()
      file.moveToDirectory(dir!)
      result.files.push({ name: getFileRelativePath(file, project), time: Date.now() - t0 })
    })
  }
  return result
}

registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

async function inquireOptions(options: MoveFileOptions) {
  // if there is any non existing file or the last input file is a directory then we assume that's our destination file
  const destinations = (options.options.files || []).filter(f => !getFileFromRelativePath(f, options.project))
  if (destinations.length) {
    return { destPath: getAbsolutePath(destinations.find(f => !isSourceFile(f)) || destinations[0], options.project) }
  } else {
    const { file } = await prompt<{ destPath: string }>([
      {
        type: 'autocomplete',
        name: 'file',
        message: 'Select the destination path',
        // @ts-ignore
        suggestOnly: true,
        validate(input: string) {
          const file = getFileFromRelativePath(input, options.project)
          if (file) {
            return `A ${
              isSourceFile(file) ? 'file' : 'directory'
            } already exists at "${input}", please choose another path. `
          }
          return true
        },
        // @ts-ignore
        source: function(answersSoFar, input: string) {
          return Promise.resolve([
            ...options.inputFiles
              .filter(f => getFileRelativePath(f, options.project).includes(input))
              .map(f => ({ name: getFileRelativePath(f, options.project), value: getFilePath(f) }))
              .sort((a, b) => a.name.localeCompare(b.name))
          ]) //TODO: add fuzzy  https://github.com/faressoft/inquirer-checkbox-plus-prompt
        }
      }
    ])
    return { destPath: getAbsolutePath(file, options.project) }
  }
  // uiLog('shhshs'+options.inputFiles.map(f=>getFileRelativePath(f, options.project)).join(', '));
}

export const moveFileFix: Fix<MoveFileOptions, { destPath: string }> = {
  name: FIX.moveFile,
  description: `
It will move the input files and/or folders to another location. 
If a single input filer is selected then the destination can be a non existent file-like path. 
The location can always be a non existent directory-like path or an existing directory path no matter the input file selection. In case the destination is an existing directory, input files will be moved inside of it.`,
  fn: moveFile,
  selectFilesMessage() {
    return 'Select files and folders to move'
  },
  inquireOptions,

  verifyInputFiles(files, options) {
    return files.length === 0 ? 'At least one input file or folder is required' : undefined
  }
}
