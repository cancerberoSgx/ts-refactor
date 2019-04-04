import { FIX, Fix, FixOptions } from '../fix'
import { simpleFixConstructor } from './simpleFixConstructor'

interface FormatOptions extends FixOptions {}

export const organizeImportsFix: Fix<FormatOptions> = {
  ...simpleFixConstructor({
    action(file) {
      file.organizeImports()
    }
  }),
  name: FIX.organizeImports,
  description: `
It will call "organize imports" TypeScript refactor on input files. 
If any input file is a directory, then it will call the refactor on each of its descendants. 
This code fix currently doesn't accept any option. `,
  selectFilesMessage() {
    return 'Select files/folders in which organize imports'
  },
  verifyInputFiles(files, options) {
    return files.length === 0 ? 'At least one input file or folder is required' : undefined
  }
}
