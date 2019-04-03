// import { CATEGORY } from './category'
import { getEnumKeys } from './misc'
import { organizeImports, organizeImportsFix } from './fix/organizeImports'
import { Project } from 'ts-morph'

export enum FIX {
  organizeImports = 'organizeImports',
  missingImports = 'missingImports',
  unusedIdentifiers = 'unusedIdentifiers',
  moveFile = 'moveFile',
  moveDeclaration = 'moveDeclaration'
}

export const fixNames = getEnumKeys(FIX)
export const fixes = [organizeImportsFix]

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
