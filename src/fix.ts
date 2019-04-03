import { getEnumKeys } from './misc'
import { Project, Node, SourceFile, Directory } from 'ts-morph'

export enum FIX {
  organizeImports = 'organizeImports',
  moveToANewFile = 'moveToANewFile',
  missingImports = 'missingImports',
  unusedIdentifiers = 'unusedIdentifiers',
  moveFile = 'moveFile',
  moveDeclaration = 'moveDeclaration'
}

export const fixNames = getEnumKeys(FIX)
export interface File {
  name: string
  isFolder: boolean
}
export interface Fix<Options extends FixOptions = FixOptions> {
  name: FIX
  fn: (options: Options) => FixResult
  /**
   * if the input file is applicable to this fix it returns undefined. Otherwise it returns a string message explaining why is not valid
   * (for example, moveDeclaration fix could return "no top level declaration found in the file")
   */
  verifyInputFiles(options: Options): string | undefined
  /**
   * Return nodes in file that apply to this fix. Fixes that don't apply to nodes, like organizeImports, dont implement this method.
   */
  getValidNodes?(file: SourceFile, options: Options): Node[]

  filterInputFiles?(files: File[]): File[]
}

export interface FixOptions {
  // fixName: FIX
  project: Project
  inputFiles: (SourceFile | Directory)[]
  nodes?: Node[]
}

export interface FixResult {
  files: FixResultFile[]
}

interface FixResultFile {
  name: string
  time: number
}
