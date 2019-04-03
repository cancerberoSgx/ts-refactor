import { Fix, FixOptions, FIX } from './fix'
import { organizeImportsFix } from './fix/organizeImports'
import { moveFileFix } from './fix/moveFile'

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
