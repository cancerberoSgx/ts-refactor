import { CATEGORY } from '../src/category'
import { FIX } from '../src/fix'
import { parseArgs } from '../src/cli/parseArgs'

describe('parseArgs', () => {
  it('should parse category and fix', () => {
    const o = parseArgs({ _: [CATEGORY.convert, FIX.organizeImports] })
    expect(o.category).toBe(CATEGORY.convert)
    expect(o.fix).toBe(FIX.organizeImports)
  })

  it('should throw on unrecognized category or fix', () => {
    expect(() => parseArgs({ _: ['unrec', FIX.organizeImports] })).toThrow()
    expect(() => parseArgs({ _: [CATEGORY.convert, 'unrec'] })).toThrow()
    expect(() => parseArgs({ _: [CATEGORY.convert, './file'] })).not.toThrow()
    expect(() => parseArgs({ _: ['./file'] })).not.toThrow()
  })

  it('should parse files with or without category or fix', () => {
    expect(parseArgs({ _: ['./file'] })).toEqual({ files: ['./file'], toolOptions: {} })
    expect(parseArgs({ _: [CATEGORY.move, './file'] })).toEqual({
      category: CATEGORY.move,
      files: ['./file'],
      toolOptions: {}
    })
    expect(parseArgs({ _: [CATEGORY.move, FIX.organizeImports, './file'] })).toEqual({
      category: CATEGORY.move,
      fix: FIX.organizeImports,
      files: ['./file'],
      toolOptions: {}
    })
  })

  it('should parse tool options with or without files, category or fix', () => {
    expect(parseArgs({ _: ['./file'], help: 'help' })).toEqual({ files: ['./file'], toolOptions: { help: true } })
    expect(parseArgs({ _: [CATEGORY.fix], help: 'help', tsConfigPath: 'foo/tsconfig.json' })).toEqual({
      category: CATEGORY.fix,
      toolOptions: { help: true, tsConfigPath: 'foo/tsconfig.json' },
      files: []
    })
  })

  it('should throw on unrecognized tool option', () => {
    expect(() => parseArgs({ _: [], unrec: 'foo' })).toThrow()
  })
})
