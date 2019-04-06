import { FIX, FixResult, File } from '../fix'
import { getFileRelativePath, isSourceFile, getFilePath, getFileFromRelativePath } from '../project'
import { Node, ClassDeclaration, InterfaceDeclaration, EnumDeclaration, TypeAliasDeclaration, FunctionDeclaration } from 'ts-morph';
import {prompt} from 'inquirer'
import { moveDeclaration } from 'ts-simple-ast-extra';
import { DestFileFixOptions, DestFileFix } from './DestinationFileFix';

interface MoveDeclarationOptions extends DestFileFixOptions {
  declaration: Declaration
}

type Declaration = // TODO: upgrade ts-simple-ast-extra and import this type
| ClassDeclaration
| InterfaceDeclaration
| EnumDeclaration
| TypeAliasDeclaration
| FunctionDeclaration

class MoveDeclaration extends DestFileFix<MoveDeclarationOptions> {

  description= `
It will move given top-level declaration to another file. These are some consequences that you might consider:
 * imports that reference the declaration in other files will be updated to point to its new file.
 * New import declarations in the original file could be created
 * Some declarations in the original file can be set to exported
 * The moved declaration might be renamed with a similar name if there's already a declaration with that name in the destination file.
WARNING: this is a complex refactor operation with and some edge cases could result on incorrect transformations. Please verify the changes and/or backup your files before saving the changes. 
 `
 destinationSuggestOnly = false
 
 _selectFilesMessage= 'Select the file containing the declaration to move'

  async inquireOptions(options: MoveDeclarationOptions) {
    const superOptions = await super.inquireOptions(options)
    const file = options.inputFiles.find(isSourceFile)
    if(!file){
      throw 'No SourceFile was given as input file'
    }
    const declarations: Declaration[] = (file.getClasses() as Declaration[]).concat(file.getInterfaces() as Declaration[]).concat(file.getEnums() as Declaration[]).concat(file.getFunctions() as Declaration[])
    const thisOptions = await prompt<{ declaration: Declaration }>([
      {
        type: 'list',
        name: 'declaration',
        message: `Select a declaration to move from file "${getFileRelativePath(file, options.project)}"`,
        choices: declarations.map(d=>({
          name: d.getName(), value: d
        }))
      }
    ])
    // const superOptions = await super.inquireOptions(options)
    Object.assign(options, superOptions, thisOptions)
    return { ...superOptions, thisOptions }
  }

  verifyInputFiles(files: File[], options: MoveDeclarationOptions) {
    return (files.length !== 1 || files[0].isFolder )?  `You can only select one file (not directory) to move the declaration to (files==${JSON.stringify(files)}, files.length==${files.length} && files[0].isFolder===${ files[0] && files[0].isFolder})` : undefined
  }

  protected validateDestinationFile(options: MoveDeclarationOptions, input: string){
    const file = getFileFromRelativePath(input, options.project)
    if (file && !isSourceFile(file)) {
      return `"${input}" is not a source file, make sure you choose a file and not a folder`
    }
    else {
      return `"${input}" file doesn't exist in project`
    }
    return true
  }
  protected getDestinationFileMessage(options: MoveDeclarationOptions): string | ((answers: { destPath: string; }) => string) | undefined {
    return 'Select the file where to move the declaration'
  }


}

export const moveDeclarationFix = new MoveDeclaration({
  action(options: MoveDeclarationOptions) {
    moveDeclaration({declaration: options.declaration,
      target: options.file})
  },
  name: FIX.moveDeclaration,
})


// function moveDeclaration(options: MoveDeclarationOptions) {
//   const { project } = options
//   const result: FixResult = { files: [] }
//   if (options.inputFiles.length === 0) {
//     throw 'No files or folder given'
//   }
//   const destPathIsFile = options.destPath.lastIndexOf('.') > options.destPath.lastIndexOf('/')
//   let dir = project.getDirectory(options.destPath)
//   const sourceFile = project.getSourceFile(options.destPath)
//   if (sourceFile) {
//     throw `A source file with path ${options.destPath} already exists. Refusing to move something at that location. `
//   } else if ((!dir && destPathIsFile && options.inputFiles.length !== 1) || !isSourceFile(options.inputFiles[0])) {
//     throw `Refusing to a folder or move several files to a destination path that looks like a file (${
//       options.destPath
//     } has an extension)`
//   } else if ((!dir && destPathIsFile) || (options.inputFiles.length === 1 && !isSourceFile(options.inputFiles[0]))) {
//     const t0 = Date.now()
//     const oldPath = getFileRelativePath(options.inputFiles[0]!, project)
//     const newFile = options.inputFiles[0].move(options.destPath, { overwrite: false })
//     result.files.push({ name: getFileRelativePath(newFile, project), time: Date.now() - t0 })
//     result.files.push({ name: oldPath, time: Date.now() - t0 })
//   } else {
//     if (!dir) {
//       const t0 = Date.now()
//       dir = project.createDirectory(options.destPath)
//       result.files.push({ name: getFileRelativePath(dir, project), time: Date.now() - t0 })
//     }
//     options.inputFiles.forEach(file => {
//       const t0 = Date.now()
//       file.moveToDirectory(dir!)
//       result.files.push({ name: getFileRelativePath(file, project), time: Date.now() - t0 })
//     })
//   }
//   return result
// }


