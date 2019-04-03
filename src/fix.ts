import { getEnumKeys } from './misc'
import { Project, Node, SourceFile } from 'ts-morph'

export enum FIX {
  organizeImports = 'organizeImports',
  missingImports = 'missingImports',
  unusedIdentifiers = 'unusedIdentifiers',
  moveFile = 'moveFile',
  moveDeclaration = 'moveDeclaration'
}

export const fixNames = getEnumKeys(FIX)

export interface Fix<Options extends FixOptions = FixOptions> {
  name: FIX
  fn: (options: Options) => FixResult
  verifyInputFiles(options: Options): string | undefined
  /**
   * Return nodes in file that apply to this fix. Fixes that don't apply to nodes, like organizeImports, dont implement this method.
   */
  getValidNodes?(file: SourceFile, options: Options): Node[]
}

export interface FixOptions {
  // fixName: FIX
  project: Project
  inputFiles: SourceFile[]
}

export interface FixResult {
  files: FixResultFile[]
}

interface FixResultFile {
  name: string
  time: number
}
