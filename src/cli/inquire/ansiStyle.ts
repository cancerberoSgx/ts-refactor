const ansiEscapes = require('ansi-escapes')
import * as ansi from 'ansi-escape-sequences'

export function fix(s: string) {
  return ansi.format(s, ['bold', 'red', 'underline'])
}

export function code(s: string) {
  return '`' + ansi.format(s, ['italic', 'green']) + '`'
}

export function link(s: string, url: string) {
  return ansiEscapes.link(s, url)
}
