import { removeAllUnused } from 'ts-simple-ast-extra'
import { FIX, Fix } from '../fix'
import { FixWithFormatCodeSettingOptions } from './formatTypes'
import { SimpleFix } from './simpleFixConstructor';

// interface RemoveUnusedOptions extends FixWithFormatCodeSettingOptions {}

export const removeUnusedFix= new SimpleFix({
  action(options) {
    removeAllUnused(options.project, options.file)
  },name: FIX.removeUnused,
  description: `
It will call "unused identifiers" TypeScript refactor on input files. 
If any input file is a directory, then it will call the refactor on each of its descendants. 
This code fix currently doesn't accept any option.`,
selectFilesMessage: 'Select files/folders to remove unused identifiers from'

})


// : Fix<RemoveUnusedOptions> = {
//   ...simpleFixConstructor({
//     action(options) {
//       removeAllUnused(project, file)
//     }
//   }),
//   name: FIX.removeUnused,
//   description: `
// It will call "unused identifiers" TypeScript refactor on input files. 
// If any input file is a directory, then it will call the refactor on each of its descendants. 
// This code fix currently doesn't accept any option.`,
//   selectFilesMessage() {
//     return 'Select files/folders to remove unused identifiers from'
//   },
//   verifyInputFiles(files, options) {
//     return files.length === 0 ? 'At least one input file or folder is required' : undefined
//   }
// }