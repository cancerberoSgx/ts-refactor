import { Fix, FixOptions, FIX } from './fix'

const fixes: Fix<FixOptions>[] = []

export function registerFix(fix: Fix) {
  fixes.push(fix)
}

export function getFixes() {
  return fixes
}

export function getFix(name: FIX) {
  return fixes.find(f => f.name === name)
}
