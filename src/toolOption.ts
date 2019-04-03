import { CATEGORY } from './category';
import { FIX } from './fix';
import { getEnumKeys } from './misc';

export interface ToolOptions {

  /**
   * Make sure there are no interactions (useful for CI - automated scripts)
   */
  noInteractive?: boolean;
  /**
   * Path to a `tsconfig.json` project configuration file, in which case that project will be the target one. 
   * 
   * By default, the tool will work with `tsconfig.json` in the current folder.
   */
  tsConfigPath?: string
  /**
   * Prints debug information to stdout.
   */
  debug?: boolean;
  /**
   * Prints usage information and exit.
   */
  help?: boolean;
}
export enum ToolOptionName {
  debug='debug',
  help='help',
  noInteractive='noInteractive',
  tsConfigPath='tsConfigPath'
}
export enum ToolOptionType{
  boolean='boolean',
  string='string',
}
export const toolOptionTypes = {
  [ToolOptionName.debug]: ToolOptionType.boolean,
  [ToolOptionName.help]: ToolOptionType.boolean,
  [ToolOptionName.noInteractive]: ToolOptionType.boolean,
  [ToolOptionName.tsConfigPath]: ToolOptionType.string
}
export const toolOptionNames = getEnumKeys(ToolOptionName)