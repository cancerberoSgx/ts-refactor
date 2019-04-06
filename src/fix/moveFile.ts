import { FIX, FixResult } from '../fix'
import { getFileRelativePath, isSourceFile } from '../project'
import { DestFileFix, DestFileFixOptions } from './abstract/destinationFileFix'

function moveFile(options: DestFileFixOptions) {
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

class MoveFile extends DestFileFix<DestFileFixOptions> {
  description = `
It will move the input files and/or folders to another location. 
If a single input filer is selected then the destination can be a non existent file-like path. 
The location can always be a non existent directory-like path or an existing directory path no matter the input file selection. In case the destination is an existing directory, input files will be moved inside of it.`
  _selectFilesMessage = 'Select files and folders to move'
}
export const moveFileFix = new MoveFile({
  name: FIX.moveFile,
  action: moveFile
})
