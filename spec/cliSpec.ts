import { Driver, ansi } from 'cli-driver'
import { rm, cp, mkdir } from 'shelljs';

describe('ts-node src/cli/cliMain.ts', () => {
  let client:Driver
  beforeAll(async () => {
    client = new Driver()
    await client.start({
      notSilent: true,
    })
  })
  afterAll(async () => {
    await client.destroy()
  })
  beforeEach(()=>{
    rm('-r', 'tmp')
    mkdir('tmp')
    cp('-r', 'spec/assets/project1', 'tmp')
  })

  it('--help should print usage help and exit with code 0', async done => {
    const data = await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts --help', 'Usage')
    ;[ '--noInteractive',
      '--tsConfigPath',
      '--dontWrite',
      '--dontConfirm',
      '--help',
      '--debug',
      `Usage: tstool fixName [...fixOptions] ...inputFiles`
     ].forEach(option=>expect(data).toContain(option))
    expect(await client.enterAndWaitForData('echo "exit code $?"', 'exit code')).toContain('exit code 0')
    done()
  })

  it('--strangeArgument should exit with code != 0', async done => {
    await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts --strangeArgument','Unknown tool option strangeArgument')
    expect(await client.enterAndWaitForData('echo "exit code $?"', 'exit code')).not.toContain('exit code 0')
    done()
  })

  it('without arguments should ask for a fix and I can exit with ctrl-c', async done => {
    await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts','Select a code fix')
    await client.write(ansi.keys.getSequenceFor({name: 'c', ctrl: true}))
    expect(await client.enterAndWaitForData('echo "control restored"', 'control restored')).toContain('control restored')
    done()
  })

  it('fixes has a last Exit option which exit with code 0', async done => {
    await client.enterAndWaitForData('npx ts-node src/cli/cliMain.ts','Select a code fix')
    await client.write(ansi.cursor.up())
    await client.enterAndWaitForData('', 'Bye')
    expect(await client.enterAndWaitForData('echo "exit code $?"', 'exit code')).toContain('exit code 0')
    done()
  })

})

