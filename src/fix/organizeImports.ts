import { code } from '../cli/inquire/ansiStyle'
import { FIX } from '../fix'
import { ToolOptionName } from '../toolOption'
import { FormatSettingsFix } from './abstract/formatSettingsFix'

export const organizeImportsFix = new FormatSettingsFix({
  action(options) {
    options.file.organizeImports()
  },
  name: FIX.organizeImports,
  description: `
It will call "organize imports" TypeScript refactor on input files. 
If any input file is a directory, then it will call the refactor on each of its descendants. 
Organize imports of several files:
  ${code(`ts-refactor ${FIX.organizeImports} "./src/**" "spec/**/*Spec.ts*" --${ToolOptionName.dontAsk}`)}

`,
  selectFilesMessage: 'Select files/folders in which organize imports'
})
