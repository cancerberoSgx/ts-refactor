import { prompt } from 'inquirer'
import { SourceFile } from 'ts-morph'
import { inquireFormatCodeSettings } from '../cli/inquire/inquireFormatCodeSettings'
import { FixOptions, FixResult } from '../fix'
import { getFileRelativePath, isSourceFile } from '../project'
// TODO: formatting options
/**
 * builds a fix function suitable for simple fixes like organizeImports, format - that have similar parameters/semantics and make modifications file by file.
 */
export function simpleFixConstructor(constructorOptions: { action: (file: SourceFile) => void }) {
  return {
    fn(options: FixOptions) {
      const { project } = options
      const result: FixResult = { files: [] }
      const inputFiles = options.inputFiles
        .map(f => (isSourceFile(f) ? [f] : f.getDescendantSourceFiles()))
        .flat()
        .filter((f, i, a) => a.indexOf(f) === i)
      inputFiles.forEach(file => {
        const t0 = Date.now()
        if (isSourceFile(file)) {
          constructorOptions.action(file)
          result.files.push({
            name: getFileRelativePath(file, project),
            time: Date.now() - t0
          })
        } else {
          throw `${getFileRelativePath(file, project)} not a source file`
        }
      })
      return result
    },
    async inquireOptions(options: FixOptions) {
      const { configureFormatCodeSettings } = await prompt<{ configureFormatCodeSettings: boolean }>([
        {
          type: 'confirm',
          name: 'configureFormatCodeSettings',
          message: 'Configure Format Code Settings?',
          default: false
        }
      ])
      if (configureFormatCodeSettings) {
        const answer = await inquireFormatCodeSettings(options)
        console.log(answer)
      }
    }
  }
}
