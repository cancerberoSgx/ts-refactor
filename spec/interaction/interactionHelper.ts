import { ansi, Driver } from 'cli-driver'

export class Helper {

  constructor(protected client: Driver) { }

  async expectLastExitCode(zeroExitCode?: boolean) {
    if (typeof zeroExitCode === 'undefined') {
      expect(
        await this.client.enterAndWaitForData(
          `echo 1; node -e "console.log('better than echo: '+ (1+1))"; echo "flush";`,
          'better than echo: 2'
        )
      ).toContain('better than echo: 2')
    } else {
      await this.client.enter(`echo "exit code $?"; node -e "console.log('better than echo: '+ (1+1))"; echo "flush";`)
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

  async focusFile(codeFix: string) {
    return this.arrowUntilFocused(this.client, codeFix, s => s.includes(` ❯◯ ${codeFix}`) || s.includes(` ❯◉ ${codeFix}`))
  }

  async focusListItem(label: string) {
    return this.arrowUntilFocused(this.client, label, s => s.includes(`❯ ${label}`))
  }

  async focusCheckboxListItem(label: string) {
    return this.arrowUntilFocused(this.client, label, s => s.includes(`❯◯ ${label}`))
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
      await this.client.write(arrow)
      await this.client.waitForData()
      await this.client.waitTime(100)
    }
    throw `Didn't found ${focused} selected in ${limit} cursor.up() strokes`
  }

  async unSelectAll(limit = 30) {
    const initial = await this.currentNotSelected()
    for (let i = 0; i < limit; i++) {
      const currentIsSelected = await this.currentSelected()
      if (currentIsSelected) {
        await this.client.writeAndWaitForData(' ', s => !!this.currentNotSelectedString(this.client.strip(s)))
      }
      await this.client.write(ansi.cursor.up())
      await this.client.waitForData()
      const current = await this.currentNotSelected()
      if (current === initial) {
        return
      }
    }
    throw `Didn't complete the loop after ${limit} cursor.up() strokes`
  }

  async currentNotSelected() {
    return this.currentNotSelectedString(await this.client.getStrippedDataFromLastWrite())
  }

  currentNotSelectedString(s: string) {
    const result = / ❯◯\s+(.+)\n/.exec(s)
    return result && result[1]
  }

  async selected() {
    const result = /  ◉\s+(.+)\n/.exec(await this.client.getStrippedDataFromLastWrite())
    return result && result[1]
  }

  async isCodeFixOptionNotSelected(option: string) {
    const s = await this.client.getStrippedDataFromLastWrite()
    return s.includes(`◯ ${option}`)
  }

  async currentSelected() {
    const result = / ❯◉\s+(.+)\n/.exec(await this.client.getStrippedDataFromLastWrite())
    return result && result[1]
  }

}
