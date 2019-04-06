import { FIX, Fix } from '../fix'
import { FixWithFormatCodeSettingOptions } from './formatTypes'
import { SimpleFix } from './simpleFixConstructor';
// import { simpleFixConstructor } from './simpleFixConstructor'

// interface FormatOptions extends FixWithFormatCodeSettingOptions {}
export const formatFix  = new SimpleFix({
  action(options) {
    options.file.organizeImports()
  }, 
 
  name: FIX.format,
  description: `
It will execute the TypeScript compiler formatter on each of given source files. 
If a directory is provided then it will format all its descendant files. 
`,selectFilesMessage: 'Select files/folders to format'
})
// export const formatFix: Fix<FormatOptions> = {
//   ...simpleFixConstructor({
//     action(file) {
//       file.organizeImports()
//     }
//   }),
//   selectFilesMessage() {
//     return 'Select files/folders to format'
//   },
//   verifyInputFiles(files, options) {
//     return files.length === 0 ? 'At least one input file or folder is required' : undefined
//   }
// }
