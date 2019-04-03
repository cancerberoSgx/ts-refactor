import { FIX, Fix, FixOptions, FixResult } from '../fix'
import { getFileRelativePath, isSourceFile, getFilePath, getFileFromRelativePath } from '../project'
import { config } from 'rxjs'
import { prompt, registerPrompt } from 'inquirer'
import Project from 'ts-morph'

interface MoveFileOptions extends FixOptions {
  destPath: string
}
/**
 * It will move the file or folder to another location
 */
function moveFile(options: MoveFileOptions) {
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
  } else if (!dir && destPathIsFile) {
    const t0 = Date.now()
    options.inputFiles[0].move(options.destPath, { overwrite: false })
    result.files.push({ name: getFileRelativePath(options.inputFiles[0]!, project), time: Date.now() - t0 })
  } else if (options.inputFiles.length === 1 && !isSourceFile(options.inputFiles[0])) {
    options.inputFiles[0].move(options.destPath, { overwrite: false })
  } else {
    if (!dir) {
      const t0 = Date.now()
      dir = project.createDirectory(options.destPath) // TODO: check if supports mkdir -p
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

export const moveFileFix: Fix<MoveFileOptions> = {
  name: FIX.moveFile,
  fn: moveFile,
  selectFilesMessage() {
    return 'Select files and folders to move'
  },
  async inquireOptions(options: MoveFileOptions) {
    registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
    return await prompt<{ destPath: string }>([
      {
        type: 'autocomplete',
        name: 'destPath',
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
              .map(f => ({ name: getFileRelativePath(f, options.project), value: getFilePath(f, options.project) }))
              .sort((a, b) => a.name.localeCompare(b.name))
          ]) //TODO: add fuzzy  https://github.com/faressoft/inquirer-checkbox-plus-prompt
        }
      }
    ])
  },
  verifyInputFiles(options) {
    return options.inputFiles.length >= 1 ? undefined : 'At least one file or folder to move is required'
  }
}
