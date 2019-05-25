import { Driver } from 'cli-driver'
import { cat, cp, mkdir, rm } from 'shelljs'
import { FIX } from '../../src/fix'
import { removeWhites } from '../../src/misc'
import { ToolOptionName } from '../../src/toolOption'
import { Helper } from './interactionHelper'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 12000

describe(`${FIX.stringTemplate} codeFix`, () => {
  let client: Driver
  let helper: Helper

  beforeAll(async done => {
    client = new Driver()
    helper = new Helper(client)
    await client.start({
      notSilent: true
    })
    done()
  })

  afterAll(async done => {
    await client.destroy().catch()
    helper = null as any
    rm('-r', 'tmp')
    done()
  })

  beforeEach(() => {
    rm('-r', 'tmp')
    mkdir('tmp')
    cp('-r', 'spec/assets/project1', 'tmp')
  })

  it('should support non interactive mode', async done => {
    expect(removeWhites(cat('tmp/project1/src/string_test2.ts').toString())).toBe(
      removeWhites(`
const a = 'a' + 2 + 'b' + 'c' + \`\${Math.PI}\`
const b = \`\${a} b c \${Math.PI} g \${function() {
  return 1
}.toString()}\`
    `)
    )
    await client.enterAndWaitForData(
      `npx ts-node -T src/cli/cliMain.ts ${
        FIX.stringTemplate
      } stringConcatenationToTemplate "./src/**/*string_*.ts*" --tsConfigPath tmp/project1/tsconfig.json --${
        ToolOptionName.dontAsk
      }`,
      'Finished writing'
    )
    await helper.expectLastExitCode(true)
    expect(removeWhites(cat('tmp/project1/src/string_test2.ts').toString())).toBe(
      removeWhites(`
const a = \`a\${2}bc\${\`\${Math.PI}\`}\`
const b = \`\${a} b c \${Math.PI} g \${function() {
  return 1
}.toString()}\`
    `)
    )
    done()
  })

  it('should complete the whole interactive path', async done => {
    expect(removeWhites(cat('tmp/project1/src/string_test2.ts').toString())).toBe(
      removeWhites(`
const a = 'a' + 2 + 'b' + 'c' + \`\${Math.PI}\`
const b = \`\${a} b c \${Math.PI} g \${function() {
  return 1
}.toString()}\`
    `)
    )
    await client.enterAndWaitForData(
      `npx ts-node -T src/cli/cliMain.ts --tsConfigPath tmp/project1/tsconfig.json`,
      'Select a code fix'
    )
    await helper.focusListItem(`${FIX.stringTemplate}`)
    await client.enterAndWaitForData('', 'Select files/folders in replace string concatenations')
    await helper.focusCheckboxListItem('src/string_test2.ts')
    await client.enterAndWaitForData(' ', 'Configure Format Code Settings?')
    await client.enterAndWaitForData('', 'Mode?')
    await helper.focusListItem('String Concatenations to Template expressions')
    await client.enterAndWaitForData('', 'The following (1) files will be modified:')
    await client.enterAndWaitForData('', 'Finished writing (1) files')
    await helper.expectLastExitCode(true)
    expect(removeWhites(cat('tmp/project1/src/string_test2.ts').toString())).toBe(
      removeWhites(`
const a = \`a\${2}bc\${\`\${Math.PI}\`}\`
const b = \`\${a} b c \${Math.PI} g \${function() {
  return 1
}.toString()}\`
    `)
    )
    done()
  })
})
