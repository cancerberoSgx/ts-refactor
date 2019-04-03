import { CATEGORY } from '../category'
import { FIX } from '../fix'
import { ToolOptions, ParsedArgs } from '../toolOption'
import { inquireCategory } from './inquire/inquireCategory'
import { inquireFix } from './inquire/inquireFix'

export async function inquireMissing(options: Partial<ParsedArgs>): Promise<ParsedArgs> {
  let category: CATEGORY
  let fix: FIX
  let files: string[] = []
  let toolOptions: ToolOptions = {}
  if (!options.category) {
    category = await inquireCategory()
  }
  if (!options.fix) {
    fix = await inquireFix()
  }
  return {
    category,
    fix,
    files,
    toolOptions
  }
}
