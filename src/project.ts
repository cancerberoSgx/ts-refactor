import { join, relative } from 'path'
import { Directory, Project, SourceFile } from 'ts-morph'

export function buildProject(options: { tsConfigFilePath: string }) {
  const project = new Project({
    tsConfigFilePath: options.tsConfigFilePath,
    addFilesFromTsConfig: true
  })
  return project
}

export function checkFilesInProject(files: (SourceFile | Directory)[], project: Project) {
  files.forEach(file => {
    if (isSourceFile(file) && !project.getSourceFile(file.getFilePath())) {
      throw `File ${file.getFilePath()} not found in project`
    } else if (!isSourceFile(file) && !project.getDirectory(file.getPath())) {
      throw `Directory ${file.getPath()} not found in project`
    }
  })
}

export function getFileRelativePath(f: SourceFile | Directory, project: Project) {
  const rootDir = project.getRootDirectories()[0]
  return rootDir.getRelativePathTo(f as SourceFile)
}

export function getBasePath(project: Project) {
  const rootDir = project.getRootDirectories()[0]
  return rootDir.getPath()
}

export function getAbsolutePath(relativePath: string, project: Project) {
  return join(getBasePath(project), relativePath).replace(/\\/g, '/')
}

export function getRelativePath(path: string, project: Project) {
  return relative(getBasePath(project), getAbsolutePath(path, project))
}

export function getFileFromRelativePath(path: string, project: Project) {
  const rootDir = project.getRootDirectories()[0]
  path = path.startsWith('./') ? path.substring(2) : path
  return rootDir.getDirectory(path) || rootDir.getSourceFile(path)
}

export function getFilePath(f: SourceFile | Directory) {
  return isSourceFile(f) ? f.getFilePath() : f.getPath()
}

export function isSourceFile(f: any): f is SourceFile {
  return f && f.organizeImports
}
