import { FIX, Fix } from '../fix'
import { FixWithFormatCodeSettingOptions } from './formatTypes'
import { simpleFixConstructor } from './simpleFixConstructor'

interface OrganizeImportsOptions extends FixWithFormatCodeSettingOptions {}

export const organizeImportsFix: Fix<OrganizeImportsOptions> = {
  ...simpleFixConstructor({
    action(file) {
      file.organizeImports()
    }
  }),
  name: FIX.organizeImports,
  description: `
It will call "organize imports" TypeScript refactor on input files. 
If any input file is a directory, then it will call the refactor on each of its descendants. 
`,
  selectFilesMessage() {
    return 'Select files/folders in which organize imports'
  },
  verifyInputFiles(files, options) {
    // console.log(files);

    return files.length === 0 ? 'At least one input file or folder is required' : undefined
  }
}
