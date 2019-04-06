import { prompt } from 'inquirer'
import {
  ClassDeclaration,
  EnumDeclaration,
  FunctionDeclaration,
  InterfaceDeclaration,
  TypeAliasDeclaration
} from 'ts-morph'
import { moveDeclaration } from 'ts-simple-ast-extra'
import { File, FIX, FixOptions } from '../fix'
import { getFileRelativePath, isSourceFile } from '../project'
import { DestFileFix, DestFileFixOptions } from './abstract/destinationFileFix'

interface MoveDeclarationOptions extends DestFileFixOptions {
  declaration: Declaration
}

type Declaration =  // TODO: upgrade ts-simple-ast-extra and import this type
  | ClassDeclaration
  | InterfaceDeclaration
  | EnumDeclaration
  | TypeAliasDeclaration
  | FunctionDeclaration

class MoveDeclaration extends DestFileFix<MoveDeclarationOptions> {
  name = FIX.moveDeclaration

  description = `
It will move given top-level declaration to another file. These are some consequences that you might consider:
 * imports that reference the declaration in other files will be updated to point to its new file.
 * New import declarations in the original file could be created
 * Some declarations in the original file can be set to exported
 * The moved declaration might be renamed with a similar name if there's already a declaration with that name in the destination file.
WARNING: this is a complex refactor operation with and some edge cases could result on incorrect transformations. Please verify the changes and/or backup your files before saving the changes. 
 `

  destinationMode: 'mustNotExist' | 'mustExist' | 'mustExistFile' = 'mustExistFile'

  _selectFilesMessage = 'Select the file containing the declaration to move'

  async inquireOptions(options: MoveDeclarationOptions) {
    const superOptions = await super.inquireOptions(options)
    const file = options.inputFiles.find(isSourceFile)
    if (!file) {
      throw new Error('No SourceFile was given as input file')
    }
    const declarations: Declaration[] = (file.getClasses() as Declaration[])
      .concat(file.getInterfaces() as Declaration[])
      .concat(file.getEnums() as Declaration[])
      .concat(file.getFunctions() as Declaration[])
    const thisOptions = await prompt<{ declaration: Declaration }>([
      {
        type: 'list',
        name: 'declaration',
        message: `Select a declaration to move from file "${getFileRelativePath(file, options.project)}"`,
        choices: declarations.map(d => ({
          name: `${d.getName()} (${(d.getKindName().endsWith('Declaration')
            ? d.getKindName().substring(0, d.getKindName().length - 'Declaration'.length)
            : d.getKindName()
          ).toLowerCase()})`,
          value: d
        }))
      }
    ])
    Object.assign(options, superOptions, thisOptions)
    return { ...options, ...superOptions, ...thisOptions }
  }

  verifyInputFiles(files: File[], options: MoveDeclarationOptions) {
    return files.length !== 1 || files[0].isFolder
      ? `You can only select one file (not directory) to select the declaration to move from. Given: files.length==${
          files.length
        } && files[0].isFolder===${files[0] && files[0].isFolder})`
      : undefined
  }

  // protected validateDestinationFile(options: MoveDeclarationOptions, input: string) {
  //   const file = getFileFromRelativePath(input, options.project)
  //   if (file && !isSourceFile(file)) {
  //     return `"${input}" is not a source file, make sure you choose a file and not a folder`
  //   } else if(!file){
  //     return `"${input}" file doesn't exist in project`
  //   }
  //   return true
  // }

  protected getDestinationFileMessage(
    options: MoveDeclarationOptions
  ): string | ((answers: { destPath: string }) => string) | undefined {
    return 'Select the file you want to move the declaration to'
  }

  fn(options: MoveDeclarationOptions) {
    const target = options.project.getSourceFile(options.destPath)!
    // if (!target || !isSourceFile(target)) {
    //   throw new Error(
    //     'Destination is not a source file: ' +
    //       options.destPath +
    //       ' - ' +
    //       options.project
    //         .getSourceFiles()
    //         .map(f => f.getFilePath())
    //         .join(', ')
    //   )
    // }
    moveDeclaration({ declaration: options.declaration, target })
    return this.buildDummyFixResult(options)
  }

  /** built dummy result with modified files after the operation is executed. */
  protected buildDummyFixResult(options: FixOptions) {
    return {
      files: options.project
        .getSourceFiles()
        .filter(f => !f.isSaved())
        .map(f => ({ name: getFileRelativePath(f, options.project), time: 0 }))
    }
  }
}

export const moveDeclarationFix = new MoveDeclaration()
