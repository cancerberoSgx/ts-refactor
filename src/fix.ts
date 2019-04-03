import { CATEGORY } from './category'
import { getEnumKeys } from './misc'

export enum FIX {
  organizeImports = 'organizeImports',
  missingImports = 'missingImports',
  unusedIdentifiers = 'unusedIdentifiers',
  moveFile = 'moveFile',
  moveDeclaration = 'moveDeclaration'
}

export const fixes = getEnumKeys(FIX)

export interface Fix {
  categories: CATEGORY[]
  name: FIX
}

export interface FixResult {
  files: FixResultFile[]
}
interface FixResultFile {
  name: string
  time: number
}
