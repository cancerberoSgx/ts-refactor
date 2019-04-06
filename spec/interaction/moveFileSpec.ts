import { Driver, ansi } from 'cli-driver'
import { rm, cp, mkdir, test } from 'shelljs'
import { Helper } from './interactiionHelper'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 12000

describe('moveFile codeFix', () => {
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
  it('should ask only for confirmation if fix, input files and dest file is provided as arguments', async done => {
    rm('-r', 'tmp')
    mkdir('tmp')
    cp('-r', 'spec/assets/project1', 'tmp')
    expect(test('-f', 'tmp/project1/src/newFile1.ts')).toBe(false)
    expect(test('-f', 'tmp/project1/src/file1.ts')).toBe(true)
    await client.enterAndWaitForData(
      'npx ts-node src/cli/cliMain.ts moveFile ./src/file1.ts ./src/newFile1.ts --tsConfigPath tmp/project1/tsconfig.json',
      'Are you sure you want to continue?'
    )
    await client.enterAndWaitForData('', 'Finished writing (2) files.')
    await helper.expectLastExitCode(true)
    expect(test('-f', 'tmp/project1/src/newFile1.ts')).toBe(true)
    expect(test('-f', 'tmp/project1/src/file1.ts')).toBe(false)
    done()
  })
  it('should not ask for anything if fix, input files and dest file is provided as arguments and --dontConfirm is passed', async done => {
    rm('-r', 'tmp')
    mkdir('tmp')
    cp('-r', 'spec/assets/project1', 'tmp')
    expect(test('-f', 'tmp/project1/src/newFile1.ts')).toBe(false)
    expect(test('-f', 'tmp/project1/src/file1.ts')).toBe(true)
    await client.enterAndWaitForData(
      'npx ts-node src/cli/cliMain.ts moveFile ./src/file1.ts ./src/newFile1.ts --tsConfigPath tmp/project1/tsconfig.json --dontConfirm',
      'Finished writing (2) files.'
    )
    // await client.enterAndWaitForData('', 'Finished writing (2) files.')
    await helper.expectLastExitCode(true)
    expect(test('-f', 'tmp/project1/src/newFile1.ts')).toBe(true)
    expect(test('-f', 'tmp/project1/src/file1.ts')).toBe(false)
    done()
  })
})
