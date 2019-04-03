import { CATEGORY } from './category';
import { getEnumKeys } from './misc';

export enum FIX {
  organizeImports = 'organizeImports',
  missingImports = "missingImports",
  unusedIdentifiers = "unusedIdentifiers",
  moveFile = "moveFile",
  moveDeclaration = "moveDeclaration"
}

export const fixes = getEnumKeys(FIX)

type CategoryFixes = {[category in CATEGORY]: FIX[]}

export const categoryFixes: CategoryFixes = {
  [CATEGORY.convert]: [FIX.organizeImports],
  [CATEGORY.fix]: [FIX.missingImports, FIX.unusedIdentifiers],
  [CATEGORY.move]: [FIX.moveFile, FIX.moveDeclaration],
}

export interface Fix {
    categories: CATEGORY[]
    name: FIX
}