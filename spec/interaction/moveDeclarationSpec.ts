import { Driver } from 'cli-driver'
import { cat, cp, mkdir, rm } from 'shelljs'
import { removeWhites } from '../../src/misc'
import { Helper } from './interactionHelper'

fdescribe('moveDeclaration codeFix', () => {
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
// issue injection!!
  fit('should accept files and declaration name via arguments', async done => { 
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
      'npx ts-node src/cli/cliMain.ts moveDeclaration ./src/decl2.ts b ./src/decl1.ts --tsConfigPath tmp/project1/tsconfig.json --dontAsk',
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
