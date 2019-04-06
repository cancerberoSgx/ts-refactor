import { FIX } from '../fix'
import { FormatSettingsFix } from './abstract/formatSettingsFix'

export const organizeImportsFix = new FormatSettingsFix({
  action(options) {
    options.file.organizeImports()
  },
  name: FIX.organizeImports,
  description: `
It will call "organize imports" TypeScript refactor on input files. 
If any input file is a directory, then it will call the refactor on each of its descendants. 
  `,
  selectFilesMessage: 'Select files/folders in which organize imports'
})
