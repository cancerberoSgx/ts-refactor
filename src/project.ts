import { Project, SourceFile, Directory } from 'ts-morph'

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

export function getSourceFileRelativePath(f: SourceFile | Directory, project: Project) {
  const rootDir = project.getRootDirectories()[0]
  return rootDir.getRelativePathTo(f as SourceFile)
}

export function getFilePath(f: SourceFile | Directory, project: Project) {
  return isSourceFile(f) ? f.getFilePath() : f.getPath()
}

export function isSourceFile(f: any): f is SourceFile {
  return f.organizeImports
}
