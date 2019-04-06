import { ansi, Driver } from 'cli-driver'
import { cp, mkdir, rm } from 'shelljs'
import { Helper } from './interactionHelper'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 12000

describe('CLI', () => {
  let client: Driver
  let helper: Helper

  beforeAll(async done => {
    client = new Driver()
    helper = new Helper(client)
    await client.start({
      notSilent: true
    })
    rm('-r', 'tmp')
    mkdir('tmp')
    cp('-r', 'spec/assets/project1', 'tmp')
    done()
  })

  afterAll(async done => {
    await client.destroy().catch()
    helper = null as any
    rm('-r', 'tmp')
    done()
  })

  describe('tool options and validation', () => {
    it('--help should print usage help and exit with code 0', async done => {
      const data = await client.enterAndWaitForData(
        'npx ts-node src/cli/cliMain.ts --help',
        'Run ts-refactor --interactiveHelp for more details'
      )
      const helpOptions = [
        '--tsConfigPath',
        '--dontWrite',
        '--dontConfirm',
        '--dontAsk',
        '--help',
        '--debug',
        `Usage: ts-refactor fixName [...fixOptions] ...inputFiles`
      ]
      helpOptions.forEach(option => expect(data).toContain(option))
      await helper.expectLastExitCode(true)
      done()
    })
    it('--InteractiveHelp should show interactive help menu, selecting exit should exit with code 0', async done => {
      const data = await client.enterAndWaitForData(
        'npx ts-node src/cli/cliMain.ts --interactiveHelp',
        'Select a Topic'
      )
      const helpOptions = ['Exit', 'Introduction', 'General Rules', 'Fix Descriptions']
      helpOptions.forEach(option => expect(data).toContain(option))
      await helper.focusListItem('Exit')
      await client.enterAndWaitForData('', 'Bye')
      await helper.expectLastExitCode(true)
      done()
    })
    it('--strangeArgument should error', async done => {
      await client.enterAndWaitForData(
        'npx ts-node src/cli/cliMain.ts --strangeArgument',
        'Unknown tool option strangeArgument'
      )
      await helper.expectLastExitCode(false)
      done()
    })
    it('should target another project with --tsConfigPath', async done => {
      expect(
        await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts organizeImports', 'Select files')
      ).not.toContain(' ◯ src/file2.ts')
      await helper.controlC()
      expect(
        await client.enterAndWaitForData(
          'npx ts-node src/cli/cliMain.ts organizeImports --tsConfigPath tmp/project1/tsconfig.json',
          'Select files'
        )
      ).toContain(' ◯ src/file2.ts')
      await helper.controlC()
      done()
    })
  })

  describe('code fixes general behavior', () => {
    it('should ask for a fix if no arguments are given at all and I can exit with ctrl-c', async done => {
      await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts', 'Select a code fix')
      await helper.controlC()
      done()
    })
    it('should error if given a non file argument that is not a codeFix', async done => {
      await client.enterAndWaitForData(
        'npx ts-node src/cli/cliMain.ts notACodeFix',
        'Error: Unknown fix notACodeFix. Must be one of'
      )
      await helper.expectLastExitCode(false)
      done()
    })
    it('fixes has a last Exit option which exit with code 0', async done => {
      await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts', 'Select a code fix')
      await client.write(ansi.cursor.up())
      await client.enterAndWaitForData('', 'Bye')
      await helper.expectLastExitCode(true)
      done()
    })
    xit('fixes have a help option', async done => {
      done()
    })
    xit('should show diff of changes before confirm', async done => {
      done()
    })
  })
})
