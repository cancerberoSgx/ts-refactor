// import { prompt } from 'inquirer'
// import {
//   ClassDeclaration,
//   EnumDeclaration,
//   FunctionDeclaration,
//   InterfaceDeclaration,
//   TypeAliasDeclaration,
//   Node,
//   SourceFile
// } from 'ts-morph'
// import { code } from 'ts-refactor/src/cli/inquire/ansiStyle'
// import { File, FIX, FixOptions } from 'ts-refactor/src/fix'
// import { getFileRelativePath, isSourceFile } from 'ts-refactor/src/project'
// import { ToolOptionName } from 'ts-refactor/src/toolOption'
// import { DestFileFix, DestFileFixOptions } from 'ts-refactor/src/fix/abstract/destinationFileFix'
// import { moveDeclaration } from 'ts-simple-ast-extra';

// interface IDeclarationFix<T extends Node>{
//   resolveInputNodesFromArguments(options: DeclarationFixOptions, declarations: T[]): T[] | undefined
// }

// interface DeclarationFixOptions extends DestFileFixOptions {
//   inputNodes: Declaration
// }

// type Declaration =  // TODO: upgrade ts-simple-ast-extra and import this type
//   | ClassDeclaration
//   | InterfaceDeclaration
//   | EnumDeclaration
//   | TypeAliasDeclaration
//   | FunctionDeclaration

// class DeclarationFix<T extends Node> extends DestFileFix<DeclarationFixOptions> implements IDeclarationFix<T>{

//   getValidNodes<T extends Node>(options: DeclarationFixOptions, file: SourceFile): T[]{
//     return  (file.getClasses() as Declaration[])
//     .concat(file.getInterfaces() as Declaration[])
//     .concat(file.getEnums() as Declaration[])
//     .concat(file.getFunctions() as Declaration[])
//     .filter(d => !!d.getName()) as any
//   }

//   resolveInputNodesFromArguments(options: DeclarationFixOptions, declarations: Declaration[]): Declaration[] {
//     return declarations.filter(d => options.options.fixOptions!.includes(d.getName()!))
//   }

//   async inquireOptions(options: DeclarationFixOptions) {
//     let declaration: Declaration | undefined
//     const superOptions = await super.inquireOptions(options)
//     const file = options.inputFiles.find(isSourceFile)
//     if (!file) {
//       throw new Error('No SourceFile was given as input file')
//     }
//     const declarations: Declaration[] = this.getValidNodes<Declaration>(options, file)
//     if (options.options.fixOptions && options.options.fixOptions) {
//       const resolved = this.resolveInputNodesFromArguments(options, declarations)
//       declaration = resolved.length > 0 ? resolved[0] :  undefined
//     }
//     if (!declaration && !(options.options.toolOptions && options.options.toolOptions.dontAsk)) {
//       const thisOptions = await prompt<{ declaration: Declaration }>([
//         {
//           type: 'list',
//           name: 'declaration',
//           message: `Select a declaration to move from file "${getFileRelativePath(file, options.project)}"`,
//           choices: declarations.map(d => ({
//             name: `${d.getName()} (${(d.getKindName().endsWith('Declaration')
//               ? d.getKindName().substring(0, d.getKindName().length - 'Declaration'.length)
//               : d.getKindName()
//             ).toLowerCase()})`,
//             value: d
//           }))
//         }
//       ])
//       declaration = thisOptions.declaration
//     }
//     if (!declaration) {
//       throw new Error(
//         `Declaration with any name in ${options.options.fixOptions} could not be found in "${getFileRelativePath(
//           file,
//           options.project
//         )}", probably because --${
//           ToolOptionName.dontAsk
//         } is used and it was not provided in arguments or didn't match. \nDeclarations found in "${getFileRelativePath(
//           file,
//           options.project
//         )}":\n ${declarations.map(d => d.getName()).join(', ')}`
//       )
//     }
//     Object.assign(options, superOptions, declaration)
//     return { ...options, ...superOptions, declaration }
//   }

//   verifyInputFiles(files: File[], options: DeclarationFixOptions) {
//     return files.length !== 1 || files[0].isFolder
//       ? `You can only select one file (not directory) to select the declaration to move from. Given: files.length==${
//           files.length
//         } && files[0].isFolder===${files[0] && files[0].isFolder})`
//       : undefined
//   }

//   protected getDestinationFileMessage(
//     options: DeclarationFixOptions
//   ): string | ((answers: { destPath: string }) => string) | undefined {
//     return 'Select the file you want to move the declaration to'
//   }

//   fn(options: DeclarationFixOptions) {
//     const target = options.project.getSourceFile(options.destPath)!
//     moveDeclaration({ declaration: options.inputNodes, target })
//     return this.buildDummyFixResult(options)
//   }

//   /** built dummy result with modified files after the operation is executed. */
//   protected buildDummyFixResult(options: FixOptions) {
//     return {
//       files: options.project
//         .getSourceFiles()
//         .filter(f => !f.isSaved())
//         .map(f => ({ name: getFileRelativePath(f, options.project), time: 0 }))
//     }
//   }
// }

// export const DeclarationFixFix = new DeclarationFix()
