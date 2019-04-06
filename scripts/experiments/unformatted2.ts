// import {prompt} from'inquirer'
// import {
// ClassDeclaration,
// EnumDeclaration,
// FunctionDeclaration,
// InterfaceDeclaration,
// TypeAliasDeclaration
// } from 'ts-morph'
// import { moveDeclaration } from 'ts-simple-ast-extra'
// import { File, FIX, FixOptions } from '../../../../src/fix'
// import { getFileRelativePath, isSourceFile } from '../../../../src/project'
// import { DestFileFix, DestFileFixOptions } from '../../../../src/fix/abstract/destinationFileFix'
// export interface ToolOptions {
// /** Make sure there are no interactions (useful for CI - automated scripts) */
// dontAsk?: boolean
// }
// export class Foo{
// async inquireOptions(options: ToolOptions) {
// let file:any
// if (!file) {
// throw new Error('No SourceFile was given as input file')
// }
// const declarations: Declaration[] = (file.getClasses() as Declaration[])
// .concat(file.getInterfaces() as Declaration[])
// .concat(file.getEnums() as Declaration[])
// .concat(file.getFunctions() as Declaration[])

// const thisOptions = await prompt<{ declaration: Declaration }>([
// {
// type: 'list',
// name: 'declaration',
// message: `Select a declaration to move from file "${getFileRelativePath(file, options as any)}"`,
// choices: declarations.map(d => ({
// name: `${d.getName()} (${(d.getKindName().endsWith('Declaration')
// ? d.getKindName().substring(0, d.getKindName().length - 'Declaration'.length)
// : d.getKindName()
// ).toLowerCase()})`,
// value: d
// }))
// }
// ])
// let superOptions
// Object.assign(options, superOptions, thisOptions)
// return { ...options, ...superOptions, ...thisOptions }
// }

// verifyInputFiles(files: File[], options: MoveDeclarationOptions) {
// return files.length !== 1 || files[0].isFolder
// ? `You can only select one file (not directory) to select the declaration to move from. Given: files.length==${
// files.length
// } && files[0].isFolder===${files[0] && files[0].isFolder})`
// : undefined
// }

// protected getDestinationFileMessage(
// options: MoveDeclarationOptions
// ): string | ((answers: { destPath: string }) => string) | undefined {
// return 'Select the file you want to move the declaration to'
// }

// fn(options: MoveDeclarationOptions) {
// const target = options.project.getSourceFile(options.destPath)!
// moveDeclaration({ declaration: options.declaration, target })
// return this.buildDummyFixResult(options)
// }

// /** built dummy result with modified files after the operation is executed. */
// protected buildDummyFixResult(options: FixOptions) {
// return {
// files: options.project
// .getSourceFiles()
// .filter(f => !f.isSaved())
// .map(f => ({ name: getFileRelativePath(f, options.project), time: 0 }))
// }
// }
// }
// type Declaration =  // TODO: upgrade ts-simple-ast-extra and import this type
// | ClassDeclaration
// | InterfaceDeclaration
// | EnumDeclaration
// | TypeAliasDeclaration
// | FunctionDeclaration
// interface MoveDeclarationOptions extends DestFileFixOptions {
// declaration: Declaration
// }