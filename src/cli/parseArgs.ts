// import { CATEGORY, categories } from '../category'
import { FIX, fixNames } from '../fix'
import {
  ToolOptions,
  ToolOptionName,
  toolOptionTypes,
  ToolOptionType,
  toolOptionNames,
  ParsedArgs
} from '../toolOption'

export interface RawArgs {
  _: string[]
  [appOptions: string]: string | boolean | string[]
}

export function parseArgs(args: RawArgs): Partial<ParsedArgs> {
  const options: Partial<ParsedArgs> = {
    toolOptions: {},
    files: []
  }
  if (args._ && args._.length > 0) {
    // if (categories.includes(args._[0])) {
    //   options.category = args._[0] as CATEGORY
    // } else if (!isFile(args._[0])) {
    //   throw `Unknown category ${args._[0]}. Must be one of [${categories.join(', ')}]`
    // }
    if (args._ && args._.length > 0) {
      if (fixNames.includes(args._[0])) {
        options.fix = args._[0] as FIX
      } else if (!isFile(args._[0])) {
        throw `Unknown fix ${args._[0]}. Must be one of [${fixNames.join(', ')}]`
      }
    }
    if (args._ && args._.length > 0) {
      options.files.push(...args._.filter(isFile))
    }
  }
  const argsToolOptionNames = Object.keys(args).filter(a => a !== '_')
  if (argsToolOptionNames.length) {
    argsToolOptionNames.forEach(o => {
      if (!toolOptionNames.includes(o)) {
        throw `Unknown tool option ${o}. Must be one of [${argsToolOptionNames.join(', ')}]`
      }
      options.toolOptions[o] = getToolOptionValue(o, args[o])
    })
  }
  return options
}

function getToolOptionValue(o: string, v: any) {
  if (toolOptionTypes[o] === ToolOptionType.boolean) {
    return !!v
  } else {
    return v + ''
  }
}

function isFile(s?: string) {
  return s && s.includes('/')
}
