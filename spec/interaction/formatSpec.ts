import { Driver } from 'cli-driver'
import { cat, cp, mkdir, rm } from 'shelljs'
import { Helper } from './interactionHelper'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 12000

describe('format codeFix', () => {
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

  it('should format without asking if fix, input file and --dontAsk are provided as arguments', async done => {
    expect(cat('tmp/project1/src/unformatted.ts').toString()).toContain(
      `
import         {readFile           } from              'fs'
export const               s =                "hello"
	`.trim()
    )
    await client.enterAndWaitForData(
      'npx ts-node -T src/cli/cliMain.ts format "./src/unformatted.ts" --tsConfigPath tmp/project1/tsconfig.json  --dontAsk',
      'Finished writing (1) files.'
    )
    await helper.expectLastExitCode(true)
    expect(cat('tmp/project1/src/unformatted.ts').toString()).toContain(
      `
import { readFile } from 'fs'
export const s = "hello"
	`.trim()
    )
    done()
  })

  it('should throw if invalid formatCodeSettings.json file is provided as arguments', async done => {
    await client.enterAndWaitForData(
      'npx ts-node -T src/cli/cliMain.ts format src/unformatted.ts ./formatCodeSettings55.json --tsConfigPath tmp/project1/tsconfig.json --dontAsk',
      'Error:'
    )
    await helper.expectLastExitCode(false)
    done()
  })

  it('should format with formatCodeSettings2.js - lots of spaces and indent size 4', async done => {
    expect(cat('tmp/project1/src/unformatted.ts').toString()).toContain(
      `
import         {readFile           } from              'fs'
export const               s =                "hello"
	`.trim()
    )
    await client.enterAndWaitForData(
      'npx ts-node -T src/cli/cliMain.ts format "./src/unformatted.ts" tmp/project1/formatCodeSettings2.json --tsConfigPath tmp/project1/tsconfig.json --dontAsk',
      'Finished writing (1) files.'
    )
    await helper.expectLastExitCode(true)
    expect(cat('tmp/project1/src/unformatted.ts').toString()).toContain(
      `
import { readFile } from "fs";
export const s = "hello";
`.trim()
    )
    done()
  })

  it('should format with formatCodeSettings1.js - no spaces , tab size 2', async done => {
    expect(cat('tmp/project1/src/unformatted.ts').toString()).toContain(
      `
import         {readFile           } from              'fs'
export const               s =                "hello"
	`.trim()
    )
    await client.enterAndWaitForData(
      'npx ts-node -T src/cli/cliMain.ts format "./src/unformatted.ts" tmp/project1/formatCodeSettings1.json --tsConfigPath tmp/project1/tsconfig.json  --dontAsk',
      'Finished writing (1) files.'
    )
    await helper.expectLastExitCode(true)
    expect(cat('tmp/project1/src/unformatted.ts').toString()).toContain(
      `
import {readFile} from 'fs'
export const s='hello'
`.trim()
    )
    done()
  })
})
