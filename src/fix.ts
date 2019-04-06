import { Directory, Project, SourceFile } from 'ts-morph'
import { getEnumKeys } from './misc'
import { ParsedArgs } from './toolOption'

export enum FIX {
  organizeImports = 'organizeImports',
  moveToANewFile = 'moveToANewFile',
  missingImports = 'missingImports',
  implementInterface = 'implementInterface',
  removeUnused = 'removeUnused',
  inferFromUsage = 'inferFromUsage',
  moveFile = 'moveFile',
  format = 'format',
  moveDeclaration = 'moveDeclaration',
  rename = 'rename',
  parametersToDestructuredObject = 'parametersToDestructuredObject',
  stringConcatenationToTemplate = 'stringConcatenationToTemplate',
  removeComments = 'removeComments',
  arrowFunction = 'arrowFunction',
  stringTemplate = 'stringTemplate',
  createDeclaration = 'createDeclaration'
}

export const fixNames = getEnumKeys(FIX)

export interface File {
  name: string
  isFolder?: boolean
  path: string
}

export interface Fix<Options extends FixOptions = FixOptions, ThisFixOptions = any> {
  /**
   * The name of this fix.
   */
  name: FIX
  description: string
  /**
   * The refactor implementation. This is called after all input files and needed Fix options are resolved (everything is ready to execute the fix).
   */
  fn(options: Options): FixResult
  /**
   * After user select the fix and the input files, concrete Fix implementations can also ask the user for another data. For example, a moveDeclaration fix can ask the user to select one or more declaration nodes from the input files and also a destination file where to move the declaration nodes. This is the analog method to `extractOptionsFromArguments` but in the interactive case.
   */
  inquireOptions?(options: Options, parsedArgs: Partial<ParsedArgs>): Promise<ThisFixOptions>
  /**
   * Fixes with custom options need to implement this method in order to extract the options from command line arguments. For example, the moveDeclaration fix, when it's called with the command `ts-refactor moveDeclaration class Foo ./src/foo ./src/model/foo`, can decide that `class` is its `nodeKind` option, `Foo` is its declaration name option and ./src/model/foo is its its destination file. This is the analog method to `inquireOptions` but in the CLI text command.
   */
  extractOptionsFromArguments?(options: Options, parsedArgs: Partial<ParsedArgs>): Promise<ThisFixOptions>
  /**
   * Through this method a fix can differentiate input files from other files that can be options. For example, in a call like `ts-refactor moveFile src/foo.ts src/bar/bar.ts` the `moveFile` can decide which file is the input file by checking if it exists (then that one will be the input file). Or differently, it can define that the first given file is the input file and the second one is the destination. It's up to the Fix implementation.
   */
  extractInputFiles?(files: File[], options: Options, parsedArgs: Partial<ParsedArgs>): File[]
  /**
   * The message to show to the user when inquiring for input files
   */
  selectFilesMessage?(): string
  /**
   * When user is selecting one or more input files interactively, fixes can validate the selection. For example a fix can validate that exactly 1 file is selected.
   */
  verifyInputFiles(files: File[], options: Options): string | undefined
}

export interface FixOptions {
  // fixName: FIX
  project: Project
  inputFiles: (SourceFile | Directory)[]
  // allFiles?: string[]
  options: Partial<ParsedArgs>
  // nodes?: Node[]
}

export interface FixResult {
  files: FixResultFile[]
}

interface FixResultFile {
  name: string
  time: number
}
