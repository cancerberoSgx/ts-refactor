import { addTrailingSemicolons, removeTrailingSemicolons } from 'ts-simple-ast-extra'
import { code } from '../cli/inquire/ansiStyle'
import { FIX } from '../fix'
import { ToolOptionName } from '../toolOption'
import { FormatSettingsFix } from './abstract/formatSettingsFix'

export const formatFix = new FormatSettingsFix({
  action(options) {
    options.file.formatText(options.formatCodeSettings)
    if (options.formatCodeSettings) {
      if (options.formatCodeSettings.trailingSemicolon) {
        addTrailingSemicolons(options.file)
      } else {
        removeTrailingSemicolons(options.file)
      }
    }
  },

  name: FIX.format,

  description: `
It will execute the TypeScript compiler formatter on each of given source files. 
If a directory is provided then it will format all its descendant files. 
This is a safe operation :)
Tip: provide a ${code(`formatCodeSettings.json`)} to configure the formatting (see General Rules section).
Format several files using a format settings json file::
  ${code(
    `ts-refactor ${FIX.format} "./src/**" "spec/**/*Spec.ts*" ./config/formatCodeSettings.json --${
      ToolOptionName.dontAsk
    }`
  )}
`,

  selectFilesMessage: 'Select files/folders to format'
})
