import { FIX } from '../fix'
import { SimpleFix } from './FormatSettingsFix'

export const formatFix = new SimpleFix({
  action(options) {
    options.file.organizeImports()
  },

  name: FIX.format,
  description: `
It will execute the TypeScript compiler formatter on each of given source files. 
If a directory is provided then it will format all its descendant files. 
`,
  selectFilesMessage: 'Select files/folders to format'
})
