import { FIX } from '../fix'
import { FormatSettingsFix } from './abstract/formatSettingsFix'

export const formatFix = new FormatSettingsFix({
  action(options) {
    options.file.formatText(options.formatCodeSettings)
  },

  name: FIX.format,
  description: `
It will execute the TypeScript compiler formatter on each of given source files. 
If a directory is provided then it will format all its descendant files. 
It will accept a formatCodeSettings.json file as input file with TypeScript FormatCodeSettings object: example: 
\`\`
`,
  selectFilesMessage: 'Select files/folders to format'
})
