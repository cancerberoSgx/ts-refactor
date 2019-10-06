import * as ansi from 'ansi-escape-sequences'
import { prompt } from 'inquirer'
import { Node, SourceFile } from 'ts-morph'
import { getName } from 'ts-simple-ast-extra'
import { getFileRelativePath, isSourceFile } from '../../project'
import { ToolOptionName } from '../../toolOption'
import { DestFileFix, DestFileFixOptions } from './destinationFileFix'

type NamedNode = { getName(): string }
export interface IInputFileFix<T extends NamedNode & Node> {
  getValidNodes(options: InputNodeFixOptions<T>, file: SourceFile): T[]
  resolveInputNodesFromArguments(options: InputNodeFixOptions<T>, file: SourceFile): T[]
  printInputNodeForInteractiveSelect(d: T): string
  getInquirerInputNodeMessage(options: InputNodeFixOptions<T>, file: SourceFile): string
  failOnInputNodeNotFound: boolean
}

export interface InputNodeFixOptions<T extends Node> extends DestFileFixOptions {
  inputNodes: T[]
}

export abstract class InputNodeFix<T extends NamedNode & Node> extends DestFileFix<InputNodeFixOptions<T>> implements IInputFileFix<T> {
  failOnInputNodeNotFound: boolean = true

  abstract getValidNodes(options: InputNodeFixOptions<T>, file: SourceFile): T[]
  abstract resolveInputNodesFromArguments(options: InputNodeFixOptions<T>, file: SourceFile): T[]
  abstract printInputNodeForInteractiveSelect(d: T): string
  abstract getInquirerInputNodeMessage(options: InputNodeFixOptions<T>, file: SourceFile): string

  async inquireOptions(options: InputNodeFixOptions<T>): Promise<InputNodeFixOptions<T>> {
    let inputNodes: T[] = []
    const superOptions = await super.inquireOptions(options)
    const file = options.inputFiles.find(isSourceFile)
    if (!file) {
      throw new Error('No SourceFile was given as input file')
    }
    const printInputNodeForInteractiveSelect = this.printInputNodeForInteractiveSelect.bind(this)
    if (options.options.fixOptions.length === 0 && options.options.toolOptions.dontAsk) {
      throw new Error(`A declaration name must be provided in order to use --dontAsk. Valid declarations found in ${file.getFilePath()} are: \n ${this.getValidNodes(options, file).map(printInputNodeForInteractiveSelect).join(', ')}`)
    }
    inputNodes = this.resolveInputNodesFromArguments(options, file)

    if (inputNodes.length > 1 && options.options.fixOptions.length == 0 && !options.options.toolOptions.dontAsk) {
      const thisOptions = await prompt<{ nodes: T[] }>([
        {
          type: 'checkbox-plus',
          name: 'nodes',
          message: this.getInquirerInputNodeMessage(options, file),
          searchable: true,
          suffix: `${ansi.format(` (Type to filter. `, ['gray'])}${ansi.format('<space>', ['cyan'])}${ansi.format(` to select, `, ['gray'])}${ansi.format('<enter>', ['cyan'])}${ansi.format(` to end)`, ['gray'])}`,
          highlight: true,
          pageSize: 10,
          validate(input, answers) {
            return input.length !== 1 ? 'Select ONE' : true
          },
          source: function(answersSoFar: string[], input: string) {
            return Promise.resolve(
              inputNodes.map(d => ({
                name: printInputNodeForInteractiveSelect(d),
                value: d
              }))
            )
          }
        }
      ])
      inputNodes = thisOptions.nodes
    }

    if (this.failOnInputNodeNotFound && inputNodes.length === 0) {
      throw new Error(
        `Input nodes with any name in ${options.options.fixOptions} could not be found in "${getFileRelativePath(file, options.project)}", probably because --${ToolOptionName.dontAsk} is used and it was not provided in arguments or didn't match. \n Valid input nodes found in "${getFileRelativePath(file, options.project)}":\n ${inputNodes.map(getName).join(', ')}`
      )
    }
    Object.assign(options, superOptions, inputNodes)
    return { ...options, ...superOptions, inputNodes } as InputNodeFixOptions<T>
  }
}
