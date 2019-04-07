import { parseArgs } from '../src/cli/parseArgs'
import { FIX } from '../src/fix'

describe('parseArgs', () => {
  it('should parse fix', () => {
    const o = parseArgs({
      _: [FIX.organizeImports]
    })
    expect(o.fix).toBe(FIX.organizeImports)
  })

  it('should throw on unrecognized category or fix', () => {
    expect(() => parseArgs({ _: [FIX.organizeImports, './file'] })).not.toThrow()
    expect(() => parseArgs({ _: ['./file'] })).not.toThrow()
  })

  it('should parse files with or without category or fix', () => {
    expect(parseArgs({ _: ['./file'] })).toEqual({ files: ['./file'], toolOptions: {}, fixOptions: [] })
    expect(parseArgs({ _: ['./file'] })).toEqual({
      files: ['./file'],
      toolOptions: {},
      fixOptions: []
    })
    expect(parseArgs({ _: [FIX.organizeImports, './file'] })).toEqual({
      fix: FIX.organizeImports,
      files: ['./file'],
      toolOptions: {},
      fixOptions: []
    })
  })

  it('should parse tool options with or without files, category or fix', () => {
    expect(parseArgs({ _: ['./file'], help: 'help' })).toEqual({
      files: ['./file'],
      toolOptions: { help: true },
      fixOptions: []
    })
    expect(
      parseArgs({
        _: [],
        help: 'help',
        tsConfigPath: 'foo/tsconfig.json'
      })
    ).toEqual({
      toolOptions: { help: true, tsConfigPath: 'foo/tsconfig.json' },
      files: [],
      fixOptions: []
    })
  })

  it('should throw on unrecognized tool option', () => {
    expect(() => parseArgs({ _: [], unrec: 'foo' })).toThrow()
  })
})
