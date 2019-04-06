import { Driver } from 'cli-driver'
import { cat, cp, mkdir, rm } from 'shelljs'
import { removeWhites } from '../../src/misc'
import { Helper } from './interactiionHelper'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 12000

describe('removeUnused codeFix', () => {
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
    done()
  })

  beforeEach(() => {
    rm('-r', 'tmp')
    mkdir('tmp')
    cp('-r', 'spec/assets/project1', 'tmp')
  })

  it('should ask for fix and input files if no arguments is given', async done => {
    await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts', 'Select a code fix')
    await helper.focusCodeFix(client, 'removeUnused')
    await client.enterAndWaitForData('', 'Select files/folders to remove unused identifiers from')
    await helper.controlC()
    done()
  })
  it('should not ask for input files if there is an file argument', async done => {
    await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts ./src/main.ts', 'Select a code fix')
    await helper.focusCodeFix(client, 'removeUnused')
    await client.enterAndWaitForData('', 'Configure Format Code Settings?')
    await helper.controlC()
    done()
  })
  it('should not ask for codeFix or input files if both are provided as arguments', async done => {
    await client.enterAndWaitForData(
      'npx ts-node src/cli/cliMain.ts removeUnused ./src/main.ts',
      'Configure Format Code Settings?'
    )
    await helper.controlC()
    done()
  })
  it('should ask only for confirmation if fix, and input files are provided as arguments', async done => {
    expect(removeWhites(cat('tmp/project1/src/test.ts').toString())).toBe(removeWhites(`var a = 1 export const c = 1`))
    await client.enterAndWaitForData(
      'npx ts-node src/cli/cliMain.ts removeUnused ./src/test.ts --tsConfigPath tmp/project1/tsconfig.json',
      'Configure Format Code Settings?'
    )
    await client.enterAndWaitForData('', 'Are you sure you want to continue?')
    await client.enterAndWaitForData('', 'Finished writing (1) files.')
    await helper.expectLastExitCode(true)
    expect(removeWhites(cat('tmp/project1/src/test.ts').toString())).toBe(removeWhites(`export const c = 1`))
    done()
  })
  it('should not ask for confirmation if fix, input files and --dontConfirm are given', async done => {
    expect(removeWhites(cat('tmp/project1/src/test.ts').toString())).toBe(removeWhites(`var a = 1 export const c = 1`))
    await client.enterAndWaitForData(
      'npx ts-node src/cli/cliMain.ts removeUnused ./src/test.ts --tsConfigPath tmp/project1/tsconfig.json --dontConfirm',
      'Configure Format Code Settings?'
    )
    await client.enterAndWaitForData('', 'Finished writing (1) files.')
    await helper.expectLastExitCode(true)
    expect(removeWhites(cat('tmp/project1/src/test.ts').toString())).toBe(removeWhites(`export const c = 1`))
    done()
  })
  it('should not ask for anything if fix, input files and --dontAsk are given', async done => {
    expect(removeWhites(cat('tmp/project1/src/test.ts').toString())).toBe(removeWhites(`var a = 1 export const c = 1`))
    await client.enterAndWaitForData(
      'npx ts-node src/cli/cliMain.ts removeUnused ./src/test.ts --tsConfigPath tmp/project1/tsconfig.json --dontAsk',
      'Finished writing (1) files.'
    )
    await helper.expectLastExitCode(true)
    expect(removeWhites(cat('tmp/project1/src/test.ts').toString())).toBe(removeWhites(`export const c = 1`))
    done()
  })
  it('should accept globs', async done => {
    expect(removeWhites(cat('tmp/project1/src/test.ts').toString())).toBe(removeWhites(`var a = 1 export const c = 1`))
    expect(removeWhites(cat('tmp/project1/src/second_test.ts').toString())).toBe(
      removeWhites(`
      export function foo(c: string) {
        var a = 1
        var b = 2
        return a
      }      
      `)
    )
    await client.enterAndWaitForData(
      'npx ts-node src/cli/cliMain.ts removeUnused "./src/**/*test.ts" --tsConfigPath tmp/project1/tsconfig.json --dontAsk',
      'Finished writing (2) files.'
    )
    await helper.expectLastExitCode(true)
    expect(removeWhites(cat('tmp/project1/src/test.ts').toString())).toBe(removeWhites(`export const c = 1`))
    expect(removeWhites(cat('tmp/project1/src/second_test.ts').toString())).toBe(
      removeWhites(`
      export function foo() {
        var a = 1
        return a
      }
      `)
    )
    done()
  })
})
