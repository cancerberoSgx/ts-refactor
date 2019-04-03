import { Project, SourceFile } from 'ts-morph'

export function buildProject(options: { tsConfigFilePath: string }) {
  const project = new Project({
    tsConfigFilePath: options.tsConfigFilePath,
    addFilesFromTsConfig: true
  })
  return project
}

export function checkFilesInProject(files: SourceFile[], project: Project) {
  files.forEach(file => {
    if (!project.getSourceFile(file.getFilePath())) {
      throw `File ${file.getFilePath()} not found in project`
    }
  })
}

export function getSourceFileRelativePath(f: SourceFile, project: Project) {
  const rootDir = project.getRootDirectories()[0]
  return rootDir.getRelativePathTo(f)
}
