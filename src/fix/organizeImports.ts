import { FIX, Fix, FixOptions, FixResult } from '../fix'
import { getSourceFileRelativePath } from '../project'
import { SourceFile, TypeGuards } from 'ts-morph'

interface OrganizeImportsOptions extends FixOptions {}
export function isSourceFile(f: any): f is SourceFile {
  return f.organizeImports
}
/**
 * It will call organize imports on given files or if not given, on every project's file.
 */
export function organizeImports(options: OrganizeImportsOptions) {
  const { project, inputFiles = options.project.getSourceFiles() } = options
  const result: FixResult = { files: [] }
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
  verifyInputFiles(options) {
    return options.inputFiles.length === 0 ? 'At least one input file required' : undefined
  }
}
