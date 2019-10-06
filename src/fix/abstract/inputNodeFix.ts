import { prompt } from 'inquirer'
import { Node, SourceFile } from 'ts-morph'
import { getName } from 'ts-simple-ast-extra'
import { getFileRelativePath, isSourceFile } from '../../project'
import { ToolOptionName } from '../../toolOption'
import { DestFileFix, DestFileFixOptions } from './destinationFileFix'

export interface IInputFileFix<T extends Node> {
  resolveInputNodesFromArguments(options: InputNodeFixOptions<T>, allValidNodesInFile: T[]): T[]
  getValidNodes(options: InputNodeFixOptions<T>, file: SourceFile): T[]
  printInputNodeForInteractiveSelect(d: T): string
  getInquirerInputNodeMessage(options: InputNodeFixOptions<T>, file: SourceFile): string
  failOnInputNodeNotFound: boolean
}

export interface InputNodeFixOptions<T extends Node> extends DestFileFixOptions {
  inputNodes: T[]
}

export abstract class InputNodeFix<T extends Node> extends DestFileFix<InputNodeFixOptions<T>>
  implements IInputFileFix<T> {
  abstract getValidNodes(options: InputNodeFixOptions<T>, file: SourceFile): T[]
  abstract resolveInputNodesFromArguments(options: InputNodeFixOptions<T>, allValidInputNodes: T[]): T[]
  abstract printInputNodeForInteractiveSelect(d: T): string
  abstract getInquirerInputNodeMessage(options: InputNodeFixOptions<T>, file: SourceFile): string
  failOnInputNodeNotFound: boolean = true

  async inquireOptions(options: InputNodeFixOptions<T>): Promise<InputNodeFixOptions<T>> {
    let inputNodes: T[] = []
    const superOptions = await super.inquireOptions(options)
    const file = options.inputFiles.find(isSourceFile)
    if (!file) {
      throw new Error('No SourceFile was given as input file')
    }
    const allValidNodesInFile = this.getValidNodes(options, file)
    if (options.options.fixOptions && options.options.fixOptions) {
      inputNodes = this.resolveInputNodesFromArguments(options, allValidNodesInFile)
    }
    if (inputNodes.length === 0 && !(options.options.toolOptions && options.options.toolOptions.dontAsk)) {
      const thisOptions = await prompt<{ nodes: T[] }>([
        // TODO: support multiple input nodes
        {
          type: 'list',
          name: 'nodes',
          message: this.getInquirerInputNodeMessage(options, file),
          choices: inputNodes.map(d => ({
            name: this.printInputNodeForInteractiveSelect(d),
            value: d
          }))
        }
      ])
      inputNodes = thisOptions.nodes
    }
    if (this.failOnInputNodeNotFound && inputNodes.length === 0) {
      throw new Error(
        `Input nodes with any name in ${options.options.fixOptions} could not be found in "${getFileRelativePath(
          file,
          options.project
        )}", probably because --${
        ToolOptionName.dontAsk
        } is used and it was not provided in arguments or didn't match. \n Valid input nodes found in "${getFileRelativePath(
          file,
          options.project
        )}":\n ${inputNodes.map(getName).join(', ')}`
      )
    }
    Object.assign(options, superOptions, inputNodes)
    return { ...options, ...superOptions, inputNodes } as InputNodeFixOptions<T>
  }
}
