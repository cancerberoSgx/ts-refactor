import { resolve } from 'path'
import { checkFilesInProject, getSourceFileRelativePath } from '../project'
import { FixResult, FixOptions, FIX, Fix } from '../fix'
import { registerFix } from '../fixes'

/**
 * It will call organize imports on given files or if not given, on every project's file.
 */
export function organizeImports(options: OrganizeImportsOptions) {
  const { project, inputFiles = options.project.getSourceFiles() } = options
  const result: FixResult = { files: [] }
  inputFiles.forEach(file => {
    const t0 = Date.now()
    file.organizeImports()
    result.files.push({
      name: getSourceFileRelativePath(file, project),
      time: Date.now() - t0
    })
  })
  return result
}

interface OrganizeImportsOptions extends FixOptions {}

const fix: Fix<OrganizeImportsOptions> = {
  name: FIX.organizeImports,
  fn: organizeImports,
  verifyInputFiles(options) {
    return options.inputFiles.length === 0 ? 'At least one input file required' : undefined
  }
}
registerFix(fix)
