// import * as diff from 'diff'

// const p = diff.createPatch('test.ts', `
// import {A} from "./a"
// console.log(1)
// export const d = 1
// `,`import {b} from "../b"
// console.log(1)
// export const c = 1
// `)

// import * as ansi from 'ansi-escape-sequences'

// const output = p.split('\n').map(l=>l.startsWith('-')?ansi.format(l, ['red']) : l.startsWith('+') ? ansi.format(l, ['green']): l).join('\n')
// console.log(output);

// const p2 = diff.structuredPatch('test.ts', `
// import {A} from "./a"
// console.log(1)
// export const d = 1
// `,`test2.ts`, `
// import {b} from "../b"
// console.log(1)
// export const c = 1
// `)
