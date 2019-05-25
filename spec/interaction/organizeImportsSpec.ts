import { Driver } from 'cli-driver'
import { cat, cp, mkdir, rm } from 'shelljs'
import { removeWhites } from '../../src/misc'
import { Helper } from './interactionHelper'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 12000

describe('organizeImports codeFix', () => {
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

  it('should ask for fix and input files if no arguments is given', async done => {
    await client.enterAndWaitForData('npx ts-node -T src/cli/cliMain.ts', 'Select a code fix')
    await helper.focusListItem('organizeImports')
    await client.enterAndWaitForData('', 'Select files/folders in which organize imports')
    await helper.controlC()
    done()
  })

  it('should not ask for input files if there is an file argument', async done => {
    await client.enterAndWaitForData('npx ts-node -T src/cli/cliMain.ts ./src/main.ts', 'Select a code fix')
    await helper.focusListItem('organizeImports')
    await client.enterAndWaitForData('', 'Configure Format Code Settings?')
    await helper.controlC()
    done()
  })

  it('should not ask for codeFix or input files if both are provided as arguments', async done => {
    await client.enterAndWaitForData(
      'npx ts-node -T src/cli/cliMain.ts organizeImports ./src/main.ts',
      'Configure Format Code Settings?'
    )
    await helper.controlC()
    done()
  })

  it('should throw error if non existent input file is provided as argument', async done => {
    await client.enterAndWaitForData(
      'npx ts-node -T src/cli/cliMain.ts organizeImports ./src/nonExistent.ts --dontAsk',
      'Error: No input files were found'
    )
    await helper.expectLastExitCode(false)
    done()
  })

  it('should dont ask anything if fix, input file and --dontAsk are provided as arguments', async done => {
    expect(removeWhites(cat('tmp/project1/src/file1.ts').toString())).toBe(
      removeWhites(`
      import { resolve, join } from 'path'
      export const c = join('a', 'b')
    `)
    )
    await client.enterAndWaitForData(
      'npx ts-node -T src/cli/cliMain.ts organizeImports "./src/file*.ts" --tsConfigPath tmp/project1/tsconfig.json  --dontAsk',
      'Finished writing (2) files.'
    )
    await helper.expectLastExitCode(true)
    expect(removeWhites(cat('tmp/project1/src/file1.ts').toString())).toBe(
      removeWhites(`
      import { join } from 'path';
      export const c = join('a', 'b')
    `)
    )
    done()
  })
})
