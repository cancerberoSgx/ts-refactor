import { Fix, FIX, FixOptions } from './fix'
import { formatFix } from './fix/format'
import { moveFileFix } from './fix/moveFile'
import { organizeImportsFix } from './fix/organizeImports'
import { removeUnusedFix } from './fix/removeUnused'
import { stringConcatenationToTemplateFix } from './fix/stringConcatenationToTemplate'

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
