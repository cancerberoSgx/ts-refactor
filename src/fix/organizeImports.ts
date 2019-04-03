import { FIX, Fix, FixOptions, FixResult } from '../fix'
import { getSourceFileRelativePath, isSourceFile } from '../project'

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
        name: getSourceFileRelativePath(file, project),
        time: Date.now() - t0
      })
    } else {
      throw `${getSourceFileRelativePath(file, project)} not a source file`
    }
  })
  return result
}

export const organizeImportsFix: Fix<OrganizeImportsOptions> = {
  name: FIX.organizeImports,
  fn: organizeImports,
  selectFilesMessage() {
    return 'Select files/folders in which organize imports'
  },
  verifyInputFiles(options) {
    return options.inputFiles.length === 0 ? 'At least one input file or folder is required' : undefined
  }
}
