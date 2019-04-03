import Project from 'ts-morph'
import { resolve } from 'path'
import { checkFilesInProject } from '../project'
import { FixResult } from '../fix'

/**
 * It will call organize imports on given files or if not given, on every project's file.
 */
export function organizeImports(options: { project: Project; files?: string[] }) {
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
