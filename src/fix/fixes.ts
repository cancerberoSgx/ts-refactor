import { Fix, FIX, FixOptions } from '../fix'
import { formatFix } from './format'
import { MoveDeclarationFix } from './moveDeclaration'
import { moveFileFix } from './moveFile'
import { organizeImportsFix } from './organizeImports'
import { removeUnusedFix } from './removeUnused'
import { stringConcatenationToTemplateFix } from './stringConcatenationToTemplate'

const fixes: Fix<FixOptions>[] = []

export function registerFix(fix: Fix) {
  fixes.push(fix)
}

export function getFixes() {
  return fixes
}

export function getFix(name: FIX) {
  return fixes.find(f => f.name.toString() == name.toString())
}

registerFix(organizeImportsFix)
registerFix(moveFileFix)
registerFix(formatFix)
registerFix(removeUnusedFix)
registerFix(stringConcatenationToTemplateFix)
registerFix(new MoveDeclarationFix())
