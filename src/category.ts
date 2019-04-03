import { getEnumKeys } from './misc'
import { FIX } from './fix'

export enum CATEGORY {
  'fix' = 'fix',
  'convert' = 'convert',
  'move' = 'move' //'rename'='rename', 'remove'='remove'
}

export const categories = getEnumKeys(CATEGORY)

type CategoryFixes = { [category in CATEGORY]: FIX[] }

export const categoryFixes: CategoryFixes = {
  [CATEGORY.convert]: [FIX.organizeImports],
  [CATEGORY.fix]: [FIX.missingImports, FIX.unusedIdentifiers],
  [CATEGORY.move]: [FIX.moveFile, FIX.moveDeclaration]
}
