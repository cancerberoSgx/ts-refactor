// import { CATEGORY } from './category'
import { getEnumKeys } from './misc'
import { Project } from 'ts-morph'
import { organizeImports } from './fix/organizeImports';

export enum FIX {
  organizeImports = 'organizeImports',
  missingImports = 'missingImports',
  unusedIdentifiers = 'unusedIdentifiers',
  moveFile = 'moveFile',
  moveDeclaration = 'moveDeclaration'
}

export const fixNames = getEnumKeys(FIX)
export const fixes = [{
  name: FIX.organizeImports,
  fn: organizeImports
}]

export interface AbstractFixOptions {
  project: Project
}
export interface Fix {
  // categories: CATEGORY[]
  name: FIX
}

export interface FixResult {
  files: FixResultFile[]
}
interface FixResultFile {
  name: string
  time: number
}
