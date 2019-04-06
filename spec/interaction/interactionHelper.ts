import { ansi, Driver } from 'cli-driver'

export class Helper {
  constructor(protected client: Driver) {}
  async expectLastExitCode(zeroExitCode?: boolean) {
    if (typeof zeroExitCode === 'undefined') {
      expect(
        await this.client.enterAndWaitForData(
          `echo 1; node -e "console.log('better than echo:', 1+1)"; echo "flush";`,
          'better than echo: 2'
        )
      ).toContain('better than echo: 2')
    } else {
      await this.client.enter(`echo "exit code $?"; node -e "console.log('better than echo:', 1+1)"; echo "flush";`)
      await this.client.waitTime(100)
      if (zeroExitCode) {
        expect(await this.client.waitForData('better than echo: 2')).toContain(`exit code 0`)
      } else {
        expect(await this.client.waitForData('better than echo: 2')).not.toContain(`exit code 0`)
      }
    }
  }
  async controlC() {
    await this.client.write(ansi.keys.getSequenceFor({ name: 'c', ctrl: true }))
    await this.expectLastExitCode()
  }
  async focusFile(client: Driver, codeFix: string) {
    return this.arrowUntilFocused(client, codeFix, s => s.includes(` ❯◯ ${codeFix}`) || s.includes(` ❯◉ ${codeFix}`))
  }
  async focusCodeFix(client: Driver, codeFix: string) {
    return this.arrowUntilFocused(client, codeFix, s => s.includes(`❯ ${codeFix}`))
  }
  async arrowUntilFocused(
    client: Driver,
    focused: string,
    predicate: (s: string) => boolean,
    arrow = ansi.cursor.down(),
    limit = 14
  ) {
    for (let i = 0; i < limit; i++) {
      const s = await client.getStrippedDataFromLastWrite()
      if (predicate(s)) {
        return s
      }
      await client.write(arrow)
      await client.waitForData()
      await client.waitTime(100)
    }
    throw `Didn't found ${focused} selected in ${limit} cursor.up() strokes`
  }
  async unSelectAll(client: Driver, limit = 30) {
    const initial = await this.currentNotSelected(client)
    for (let i = 0; i < limit; i++) {
      const currentIsSelected = await this.currentSelected(client)
      if (currentIsSelected) {
        await client.writeAndWaitForData(' ', s => !!this.currentNotSelectedString(client.strip(s)))
      }
      await client.write(ansi.cursor.up())
      await client.waitForData()
      const current = await this.currentNotSelected(client)
      if (current === initial) {
        return
      }
    }
    throw `Didn't complete the loop after ${limit} cursor.up() strokes`
  }
  async currentNotSelected(client: Driver) {
    return this.currentNotSelectedString(await client.getStrippedDataFromLastWrite())
  }
  currentNotSelectedString(s: string) {
    const result = / ❯◯\s+(.+)\n/.exec(s)
    return result && result[1]
  }
  async selected(client: Driver) {
    const result = /  ◉\s+(.+)\n/.exec(await client.getStrippedDataFromLastWrite())
    return result && result[1]
  }
  async isCodeFixOptionNotSelected(client: Driver, option: string) {
    const s = await client.getStrippedDataFromLastWrite()
    return s.includes(`◯ ${option}`)
  }
  async currentSelected(client: Driver) {
    const result = / ❯◉\s+(.+)\n/.exec(await client.getStrippedDataFromLastWrite())
    return result && result[1]
  }
}
