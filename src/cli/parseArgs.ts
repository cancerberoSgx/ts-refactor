import { CATEGORY, categories } from '../category'
import { FIX, fixes } from '../fix'
import { ToolOptions, ToolOptionName, toolOptionTypes, ToolOptionType, toolOptionNames } from '../toolOption'

interface RawArgs {
  _: string[]
  [appOptions: string]: string | boolean | string[]
}

interface ParsedArgs {
  category: CATEGORY
  fix: FIX
  files: string[]
  toolOptions: ToolOptions
}

export function parseArgs(args: RawArgs): Partial<ParsedArgs> {
  const options: Partial<ParsedArgs> = {
    toolOptions: {},
    files: []
  }
  if (args._ && args._.length > 0) {
    if (categories.includes(args._[0])) {
      options.category = args._[0] as CATEGORY
    } else if (!isFile(args._[0])) {
      throw `Unknown category ${args._[0]}. Must be one of [${categories.join(', ')}]`
    }
    if (args._ && args._.length > 1) {
      if (fixes.includes(args._[1])) {
        options.fix = args._[1] as FIX
      } else if (!isFile(args._[1])) {
        throw `Unknown fix ${args._[0]}. Must be one of [${fixes.join(', ')}]`
      }
    }
    if (args._ && args._.length > 0) {
      options.files.push(...args._.filter(isFile))
    }
  }
  const argsToolOptionNames = Object.keys(args).filter(a => a !== '_')
  if (argsToolOptionNames.length) {
    // const toolOptions: ToolOptions = {}
    argsToolOptionNames.forEach(o => {
      if (!toolOptionNames.includes(o)) {
        throw `Unknown tool option ${o}. Must be one of [${argsToolOptionNames.join(', ')}]`
      }
      options.toolOptions[o] = getToolOptionValue(o, args[o])
    })
    // options.toolOptions = toolOptions
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

function isFile(s: string) {
  return s.includes('/')
}
