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
import { code } from '../cli/inquire/ansiStyle';
import { ToolOptionName } from '../toolOption';

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
Move one declaration of src/foo.ts to existing file src/bar.ts:
  ${code(`ts-refactor ${FIX.moveDeclaration} src/foo.ts src/bar.ts`)}
 `

 protected destinationMode: 'mustNotExist' | 'mustExist' | 'mustExistFile' = 'mustExistFile'

  protected _selectFilesMessage = 'Select the file containing the declaration to move'

  async inquireOptions(options: MoveDeclarationOptions) {
    let declaration : Declaration|undefined
    console.log(options.inputFiles.map(f=>f.getBaseName()), options.options.files);
    
    const superOptions = await super.inquireOptions(options)
    const file = options.inputFiles.find(isSourceFile)
    if (!file) {
      throw new Error('No SourceFile was given as input file')
    }
    const declarations: Declaration[] = (file.getClasses() as Declaration[])
      .concat(file.getInterfaces() as Declaration[])
      .concat(file.getEnums() as Declaration[])
      .concat(file.getFunctions() as Declaration[])
      .filter(d=>!!d.getName())
    if(options.options.fixOptions && options.options.fixOptions.find(o=>o!==FIX.moveDeclaration)) {
      const names = options.options.fixOptions.filter(o=>o!==FIX.moveDeclaration)
      declaration = declarations.find(d=>names.includes(d.getName()!))
    }
    if(!declaration && !(options.options.toolOptions&&options.options.toolOptions.dontAsk)){
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
      declaration = thisOptions.declaration
    }    
    if(!declaration){
      throw new Error(`Declaration with any name in ${options.options.fixOptions} could not be found in "${getFileRelativePath(file, options.project)}", probably because --${ToolOptionName.dontAsk} is used and it was not provided in arguments or didn't match. \nDeclarations found in "${getFileRelativePath(file, options.project)}":\n ${declarations.map(d=>d.getName()).join(', ')}`)
    }
    Object.assign(options, superOptions, declaration)
    return { ...options, ...superOptions,declaration }
  }

  verifyInputFiles(files: File[], options: MoveDeclarationOptions) {
    return files.length !== 1 || files[0].isFolder
      ? `You can only select one file (not directory) to select the declaration to move from. Given: files.length==${
          files.length
        } && files[0].isFolder===${files[0] && files[0].isFolder})`
      : undefined
  }

  protected getDestinationFileMessage(
    options: MoveDeclarationOptions
  ): string | ((answers: { destPath: string }) => string) | undefined {
    return 'Select the file you want to move the declaration to'
  }

  fn(options: MoveDeclarationOptions) {
    const target = options.project.getSourceFile(options.destPath)!
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
