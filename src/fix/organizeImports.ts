import { FIX, Fix } from '../fix'
import { FixWithFormatCodeSettingOptions } from './formatTypes'
import { SimpleFix } from './simpleFixConstructor';

// interface OrganizeImportsOptions extends FixWithFormatCodeSettingOptions {}

// const o = simpleFixConstructor({
//   action(file) {
//     file.organizeImports()
//   }
// })
// class OrganizeImportsFix extends SimpleFix implements Fix<OrganizeImportsOptions>{
// //   name= FIX.organizeImports
// //   description= `
// // It will call "organize imports" TypeScript refactor on input files. 
// // If any input file is a directory, then it will call the refactor on each of its descendants. 
// // `
// electFilesMessage() {
//   return 'Select files/folders in which organize imports'
// }
// verifyInputFiles(files, options) {
//   // console.log(files);

//   return files.length === 0 ? 'At least one input file or folder is required' : undefined
// }
// }

export const organizeImportsFix = new SimpleFix({
  action(options) {
    options.file.organizeImports()
  }, 
  name : FIX.organizeImports, 
  description: `
It will call "organize imports" TypeScript refactor on input files. 
If any input file is a directory, then it will call the refactor on each of its descendants. 
  `,
selectFilesMessage: 'Select files/folders in which organize imports'

})

// o.
// export const organizeImportsFix: Fix<OrganizeImportsOptions> = {
//   ...o,
//   name: FIX.organizeImports,
//   description: `
// It will call "organize imports" TypeScript refactor on input files. 
// If any input file is a directory, then it will call the refactor on each of its descendants. 
// `,
//   selectFilesMessage() {
//     return 'Select files/folders in which organize imports'
//   },
//   verifyInputFiles(files, options) {
//     // console.log(files);

//     return files.length === 0 ? 'At least one input file or folder is required' : undefined
//   }
// }
