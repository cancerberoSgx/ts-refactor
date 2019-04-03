import { CATEGORY, categories } from '../category';
import { FIX, fixes } from '../fix';
import { RawArgs, Options } from '../types';

export function parseArgs(args: RawArgs): Partial<Options> {
  const options: Partial<Options> = {};
  if (args._ && args._.length > 0) {
    if (categories.includes(args._[0])) {
      options.category = args._[0] as CATEGORY;
    }
    else if(!isFile(args._[0])){
      throw `Unknown category ${args._[0]}. Must be one of [${categories.join(', ')}]`;
    }
    if (args._ && args._.length > 1) {
      if (fixes.includes(args._[1])) {
        options.fix = args._[1] as FIX;
      }
      else if(!isFile(args._[1])){
        throw `Unknown fix ${args._[0]}. Must be one of [${fixes.join(', ')}]`;
      }
    }
    if (args._ && args._.length > 0) {
      options.files = args._.filter(isFile)
    }
  }
  return options;
}

function isFile(s:string){
  return s.includes('/')
}