import { removeAllUnused } from 'ts-simple-ast-extra'
import { FIX, fixNames } from '../fix'
import { FormatSettingsFix } from './abstract/formatSettingsFix'
import { code } from '../cli/inquire/ansiStyle';

export const removeUnusedFix = new FormatSettingsFix({
  action(options) {
    removeAllUnused(options.project, options.file)
  },
  name: FIX.removeUnused,
  description: `
It will call "unused identifiers" TypeScript refactor on input files. 
If any input file is a directory, then it will call the refactor on each of its descendants. 
This code fix currently doesn't accept any option.
WARNING: This is not a safe operation. It's currently implemented by the TypeScript compiler and it's somewhat aggressive. Check the changes before applying and backup your data first!
Remove unused identifiers of several files:
  ${code(`ts-refactor ${FIX.removeUnused} "./src/**" "spec/**/*Spec.ts*" --dontAsk`)}
`,
  selectFilesMessage: 'Select files/folders to remove unused identifiers from'
})
