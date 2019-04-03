import { resolve } from 'path'
import { Project } from 'ts-morph'

export function buildProject(options: { tsConfigFilePath: string }) {
  const project = new Project({
    tsConfigFilePath: options.tsConfigFilePath,
    addFilesFromTsConfig: true
  })
  return project
}

export function checkFilesInProject(files: string[], projectFiles: string[]) {
  files.forEach(file => {
    if (!projectFiles.includes(resolve(file))) {
      throw `File ${file} not found in project`
    }
  })
}
