import { Driver, ansi } from 'cli-driver'
import { rm, cp, mkdir } from 'shelljs'
import { Helper } from './interactiionHelper'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 12000

describe('CLI', () => {
  let client: Driver
  let helper: Helper

  beforeAll(async done => {
    client = new Driver()
    helper = new Helper(client)
    await client.start({
      notSilent: true
      // waitUntilTimeout: 20000
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
      const data = await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts --help', 'Usage')
      const helpOptions = [
        '--noInteractive',
        '--tsConfigPath',
        '--dontWrite',
        '--dontConfirm',
        '--help',
        '--debug',
        `Usage: tstool fixName [...fixOptions] ...inputFiles`
      ]
      helpOptions.forEach(option => expect(data).toContain(option))
      expect(await client.enterAndWaitForData('echo "exit code $?"', 'exit code')).toContain('exit code 0')
      done()
    })
    it('--strangeArgument should error', async done => {
      await client.enterAndWaitForData(
        'npx ts-node src/cli/cliMain.ts --strangeArgument',
        'Unknown tool option strangeArgument'
      )
      expect(await client.enterAndWaitForData('echo "exit code $?"', 'exit code')).not.toContain('exit code 0')
      done()
    })
    it('should target another project with --tsConfigPath', async done => {
      expect(
        await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts organizeImports', 'Select files')
      ).not.toContain(' ◯ src/file2.ts')
      await helper.controlC()
      // await client.cleanData()
      expect(
        await client.enterAndWaitForData(
          'npx ts-node src/cli/cliMain.ts organizeImports --tsConfigPath tmp/project1/tsconfig.json',
          'Select files'
        )
      ).toContain(' ◯ src/file2.ts')
      await helper.controlC()
      done()
    })
    xit('With --no-interactive it should fail if there is any missing data', async done => {
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
      helper.expectLastExitCode(false)
      done()
    })
    it('fixes has a last Exit option which exit with code 0', async done => {
      await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts', 'Select a code fix')
      await client.write(ansi.cursor.up())
      await client.enterAndWaitForData('', 'Bye')
      helper.expectLastExitCode(true)
      done()
    })
    xit('fixes have a help option', async done => {
      done()
    })
  })

  describe('moveFile codeFix', () => {
    it('should ask for fix and input files if no arguments is given', async done => {
      await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts', 'Select a code fix')
      await helper.focusCodeFix(client, 'moveFile')
      await client.enterAndWaitForData('', 'Select files and folders to move')
      await helper.controlC()
      done()
    })
    it('should not ask for input files if there is an file argument', async done => {
      await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts ./src/main.ts', 'Select a code fix')
      await helper.focusCodeFix(client, 'moveFile')
      await client.enterAndWaitForData('', 'Select the destination path')
      await helper.controlC()
      done()
    })
    it('should not ask for codeFix or input files if both are provided as arguments', async done => {
      await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts ./src/main.ts', 'Select a code fix')
      await helper.focusCodeFix(client, 'moveFile')
      await client.enterAndWaitForData('', 'Select the destination path')
      await helper.controlC()
      done()
    })
  })
})
