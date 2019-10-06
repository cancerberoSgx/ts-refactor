import { Node, SourceFile } from 'ts-morph'
import * as ansi from 'ansi-escape-sequences'
import { getName } from 'ts-simple-ast-extra'
import { getFileRelativePath, isSourceFile } from '../../project'
import { ToolOptionName } from '../../toolOption'
import { DestFileFix, DestFileFixOptions } from './destinationFileFix'
import { prompt, registerPrompt } from 'inquirer'

type NamedNode = {getName():string}
export interface IInputFileFix<T extends NamedNode&Node> {
  // resolveInputNodesFromArguments(options: InputNodeFixOptions<T>, allValidNodesInFile: T[]): T[]
  getValidNodes(options: InputNodeFixOptions<T>, file: SourceFile): T[]
  resolveInputNodesFromArguments(options: InputNodeFixOptions<T> , file: SourceFile): T[]
  printInputNodeForInteractiveSelect(d: T): string
  getInquirerInputNodeMessage(options: InputNodeFixOptions<T>, file: SourceFile): string
  failOnInputNodeNotFound: boolean
}

export interface InputNodeFixOptions<T extends Node> extends DestFileFixOptions {
  inputNodes: T[]
}

export abstract class InputNodeFix<T extends NamedNode&Node> extends DestFileFix<InputNodeFixOptions<T>> implements IInputFileFix<T> {
  failOnInputNodeNotFound: boolean = true

  abstract getValidNodes(options: InputNodeFixOptions<T>, file: SourceFile): T[]
  abstract resolveInputNodesFromArguments(options: InputNodeFixOptions<T> , file: SourceFile): T[]
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

    // const allValidNodesInFile = 
    // if (options.options.fixOptions && options.options.fixOptions) {
      // let inputNode  =
      if(options.options.fixOptions.length===0&&options.options.toolOptions.dontAsk){
        throw new Error(`A declaration name must be provided in order to use --dontAsk. Valid declarations found in ${file.getFilePath()} are: \n ${this.getValidNodes(options, file).map(printInputNodeForInteractiveSelect).join(', ')}`)
      }
      inputNodes = this.resolveInputNodesFromArguments(options, file)
    // }

    if (inputNodes.length >1 && options.options.fixOptions.length==0 && !options.options.toolOptions.dontAsk) {
      console.log(options.options.toolOptions.dontAsk);
      
registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))
      // if(!options.options.toolOptions.dontAsk){
      const thisOptions = await prompt<{ nodes: T[] }>([
        // TODO: support multiple input nodes
        {
          type: 'checkbox-plus',
          name: 'nodes',
          message: this.getInquirerInputNodeMessage(options, file),
          searchable: true,
      suffix: `${ansi.format(` (Type to filter. `, ['gray'])}${ansi.format('<space>', ['cyan'])}${ansi.format(
        ` to select, `,
        ['gray']
      )}${ansi.format('<enter>', ['cyan'])}${ansi.format(` to end)`, ['gray'])}`,
      highlight: true,
      pageSize: 10,
      validate(input , answers) {
        return input.length===0?'You must select at least one':true  
      },
      source: function(answersSoFar: string[], input: string) {
        return Promise.resolve(
          inputNodes.map(d => ({
            name: printInputNodeForInteractiveSelect(d),
            value: d
          }))
          // allFiles
          //   .filter(f => !f.name.startsWith('..') && f.name.includes(input))
          //   .map(f => ({ name: f.name.replace(input, `${ansi.format(input, ['green'])}`), value: f }))
        )
      }

          // choices: inputNodes.map(d => ({
          //   name: this.printInputNodeForInteractiveSelect(d),
          //   value: d
          // }))
        }
      ])
      inputNodes = thisOptions.nodes
      // } else {
      //   throw new Error(`Multiple nodes matched but --dontAsk was given. Aborting. Valid declarations found in ${file.getFilePath()} are: \n ${this.getValidNodes(options, file).map(f=>f.getName()+`(${f.getKindName()})`).join(', ')}`)
      // }
    // }
    // } else {

    }

    if (this.failOnInputNodeNotFound && inputNodes.length === 0) {
      throw new Error(
        `Input nodes with any name in ${options.options.fixOptions} could not be found in "${getFileRelativePath(          file,          options.project        )}", probably because --${        ToolOptionName.dontAsk        } is used and it was not provided in arguments or didn't match. \n Valid input nodes found in "${getFileRelativePath(          file,          options.project        )}":\n ${inputNodes.map(getName).join(', ')}`
      )
    }
    Object.assign(options, superOptions, inputNodes)
    return { ...options, ...superOptions, inputNodes } as InputNodeFixOptions<T>
  }
}
