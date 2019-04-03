import { FIX, Fix, FixOptions, FixResult } from '../fix'
import { getFileRelativePath, isSourceFile } from '../project'

interface OrganizeImportsOptions extends FixOptions {}
/**
 * It will call organize imports on given files or if not given, on every project's file.
 */
export function organizeImports(options: OrganizeImportsOptions) {
  const { project } = options
  const result: FixResult = { files: [] }
  const inputFiles = options.inputFiles
    .map(f => (isSourceFile(f) ? [f] : f.getDescendantSourceFiles()))
    .flat()
    .filter((f, i, a) => a.indexOf(f) === i)
  inputFiles.forEach(file => {
    const t0 = Date.now()
    if (isSourceFile(file)) {
      file.organizeImports()
      result.files.push({
        name: getFileRelativePath(file, project),
        time: Date.now() - t0
      })
    } else {
      throw `${getFileRelativePath(file, project)} not a source file`
    }
  })
  return result
}

export const organizeImportsFix: Fix<OrganizeImportsOptions> = {
  name: FIX.organizeImports,
  description: `It will call "organize imports" TypeScript refactor on input files. If any input file is a directory, then it will call the refactor on each of its descendants. If no file is selected it will call the refactor, on every project's file.`,
  fn: organizeImports,
  selectFilesMessage() {
    return 'Select files/folders in which organize imports'
  },
  verifyInputFiles(files, options) {
    return files.length === 0 ? 'At least one input file or folder is required' : undefined
  }
}
