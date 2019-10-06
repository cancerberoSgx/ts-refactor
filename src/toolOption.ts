import { enumKeys } from 'misc-utils-of-mine-generic'
import { FIX } from './fix'

export interface ParsedArgs {
  fix: FIX
  fixOptions: string[]
  files: string[]
  toolOptions: ToolOptions
}

export interface ToolOptions {
  /**
   * Make sure there are no interactions (useful for CI - automated scripts)
   */
  dontAsk?: boolean
  /**
   * Path to a `tsconfig.json` project configuration file, in which case that project will be the target one.
   * 
   * By default, the tool will work with `tsconfig.json` in the current folder.
   */
  tsConfigPath?: string
  /**
   * If true, the tool won't write changes to the files. This is useful to simulate if the fix won't fail, how many
   * changes there would be, etc.
   */
  dontWrite?: boolean
  dontConfirm?: boolean
  /**
   * Prints debug information to stdout.
   */
  debug?: boolean
  /**
   * Prints usage information and exit.
   */
  help?: boolean

  /**
   * Runs the built-in interactive help that describe each fix and usage instructions in detail.  Then exits.
   */
  interactiveHelp?: boolean
}

export enum ToolOptionName {
  debug = 'debug',
  help = 'help',
  dontAsk = 'dontAsk',
  tsConfigPath = 'tsConfigPath',
  dontWrite = 'dontWrite',
  dontConfirm = 'dontConfirm',
  interactiveHelp = 'interactiveHelp'
}

export enum ToolOptionType {
  boolean = 'boolean',
  string = 'string'
}

export const toolOptionTypes = {
  [ToolOptionName.debug]: ToolOptionType.boolean,
  [ToolOptionName.help]: ToolOptionType.boolean,
  [ToolOptionName.dontAsk]: ToolOptionType.boolean,
  [ToolOptionName.tsConfigPath]: ToolOptionType.string,
  [ToolOptionName.dontWrite]: ToolOptionType.boolean,
  [ToolOptionName.dontConfirm]: ToolOptionType.boolean
}

export const toolOptionNames = enumKeys(ToolOptionName)
