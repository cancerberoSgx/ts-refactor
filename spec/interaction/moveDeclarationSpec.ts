import { Driver } from 'cli-driver'
import { removeWhites } from 'misc-utils-of-mine-generic'
import { cat, cp, mkdir, rm } from 'shelljs'
import { Helper } from './interactionHelper'

describe('moveDeclaration codeFix', () => {
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

  beforeEach(() => {
    rm('-r', 'tmp')
    mkdir('tmp')
    cp('-r', 'spec/assets/project1', 'tmp')
  })

  it(' A declaration name must be provided in order to use --dontAsk', async done => {
    const s = await client.enterAndWaitForData(
      'npx ts-node -T src/cli/cliMain.ts moveDeclaration src/lotsOfMovables.ts src/file1.ts --tsConfigPath tmp/project1/tsconfig.json --dontAsk',
      'Error: A declaration name must be provided in order to use --dontAsk'
    )
    expect(s).toContain('C(class), I(interface), A(typealias)')
    await helper.expectLastExitCode(false)
    done()
  })

  // issue injection!!
  xit('should accept files and declaration name via arguments', async done => {
    expect(removeWhites(cat('tmp/project1/src/decl1.ts').toString())).toBe(
      removeWhites(`
        export function f(a: string){return a+ b(a)}
        import {b} from './decl2'
    `)
    )
    expect(removeWhites(cat('tmp/project1/src/decl2.ts').toString())).toBe(
      removeWhites(`
        export function b(a: string){
          return b
        }
        import {f} from'./decl1'
        export const g = f('asd')
    `)
    )
    await client.enterAndWaitForData(
      'npx ts-node -T src/cli/cliMain.ts moveDeclaration ./src/decl2.ts b ./src/decl1.ts --tsConfigPath tmp/project1/tsconfig.json --dontAsk',
      'Finished writing'
    )
    await helper.expectLastExitCode(true)
    expect(removeWhites(cat('tmp/project1/src/decl1.ts').toString())).toBe(
      removeWhites(`
        export function b(a: string) {
          return b
        }
        export function f(a: string){return a+ b(a)}
    `)
    )
    expect(removeWhites(cat('tmp/project1/src/decl2.ts').toString())).toBe(
      removeWhites(`
        import { f } from './decl1';
        export const g = f('asd')
    `)
    )
    done()
  })
})
