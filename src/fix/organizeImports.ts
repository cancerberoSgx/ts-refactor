import Project from 'ts-morph'
import { resolve } from 'path'
import { checkFilesInProject } from '../project'
import { FixResult, AbstractFixOptions, FIX } from '../fix'

/**
 * It will call organize imports on given files or if not given, on every project's file.
 */
export function organizeImports(options: OrganizeImportsOptions) {
  const { project, files = project.getSourceFiles().map(f => f.getFilePath()) } = options
  const projectFiles = project.getSourceFiles().map(f => resolve(f.getFilePath()))
  checkFilesInProject(files, projectFiles)
  const result: FixResult = { files: [] }
  files.forEach(file => {
    const t0 = Date.now()
    project.getSourceFileOrThrow(file).organizeImports()
    result.files.push({
      name: file,
      time: Date.now() - t0
    })
  })
  return result
}
export const organizeImportsFix = {
  name: FIX.organizeImports,
  fn: organizeImports
}
interface OrganizeImportsOptions extends AbstractFixOptions {
  files?: string[]
}
