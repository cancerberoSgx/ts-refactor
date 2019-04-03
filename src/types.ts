import { CATEGORY } from './category';
import { FIX } from './fix';
let types;
export interface RawArgs {
  _: string[];
  [appOptions: string]: string | boolean | string[];
}
export interface Options {
  category: CATEGORY;
  fix: FIX;
  files: string[];
  generalOptions: ToolOptions;
}
interface ToolOptions {
  /**
   * Prints debug information to stdout.
   */
  debug?: boolean;
  /**
   * Prints usage information and exit.
   */
  help?: boolean;
  /**
   * Make sure there are no interactions (useful for CI - automated scripts)
   */
  noInteractive?: boolean;
}
