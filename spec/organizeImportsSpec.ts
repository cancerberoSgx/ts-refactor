import { cp, mkdir, rm } from 'shelljs'
import { organizeImportsFix } from '../src/fix/organizeImports'
import { buildProject } from '../src/project'
import { getFixes } from '../src/fix/fixes'
import { FIX } from '../src/fix'

describe('organizeImports', () => {
  const projectPath = 'tmp/organizeImports'

  function test(files?: string[]) {
    mkdir('-p', projectPath)
    rm('-r', projectPath)
    cp('-r', 'spec/assets/project1', projectPath)
    const project = buildProject({ tsConfigFilePath: `${projectPath}/tsconfig.json` })
    expect(
      project
        .getSourceFiles()
        .find(f => f.getFilePath().endsWith(`${projectPath}/src/file1.ts`))!
        .getText()
    ).toContain(`import { resolve, join } from 'path'`)
    expect(
      project
        .getSourceFiles()
        .find(f => f.getFilePath().endsWith(`${projectPath}/src/file2.ts`))!
        .getText()
    ).toContain(`import { c } from './file1'`)
    const result = organizeImportsFix.fn({
      project,
      inputFiles: project.getSourceFiles().filter(f => (files ? files.find(f2 => f.getFilePath().endsWith(f2)) : true)),
      options: {
        files: [], fixOptions: [],  toolOptions: {}
      }
    })
    return {
      result,
      project,
      file1: project
        .getSourceFiles()
        .find(f => f.getFilePath().endsWith(`${projectPath}/src/file1.ts`))!
        .getText(),
      file2: project
        .getSourceFiles()
        .find(f => f.getFilePath().endsWith(`${projectPath}/src/file2.ts`))!
        .getText()
    }
  }

  it('should call on every file if files is not given', () => {
    const { file1, file2, result, project } = test()
    expect(file1).toContain(`import { join } from 'path'`)
    expect(file2).not.toContain(`import { c } from './file1'`)
    expect(result.files.length).toBe(project.getSourceFiles().length)
  })

  it('should call only on given files', () => {
    const { file1, file2, result, project } = test([`${projectPath}/src/file1.ts`])
    expect(file1).toContain(`import { join } from 'path'`)
    expect(file2).toContain(`import { c } from './file1'`)
    expect(result.files.length).toBe(1)
  })
})
