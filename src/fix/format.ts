import { FIX, Fix, FixOptions } from '../fix'
import { simpleFixConstructor } from './simpleFixConstructor'
import { FormatCodeSettings, FixWithFormatCodeSettingOptions } from './formatTypes';

interface FormatOptions extends FixWithFormatCodeSettingOptions {
  
}

export const formatFix: Fix<FormatOptions> = {
  ...simpleFixConstructor({
    action(file) {
      file.organizeImports()
    }
  }),
  name: FIX.format,
  description: `
It will execute the TypeScript compiler formatter on each of given source files. 
If a directory is provided then it will format all its descendant files. `,
  selectFilesMessage() {
    return 'Select files/folders to format'
  },
  verifyInputFiles(files, options) {
    return files.length === 0 ? 'At least one input file or folder is required' : undefined
  }
}
