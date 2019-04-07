// import { tsquery } from '@phenomnomnominal/tsquery';
// import chalk from 'chalk';
// import { prompt, Questions } from 'inquirer';
// import * as _ from 'lodash';
// import { Node, SourceFile } from 'typescript';
// const { map, takeUntil } = require('rxjs/operators')
// const Base = require('inquirer/lib/prompts/base')
// const observe = require('inquirer/lib/utils/events')

// /**
//  * Ast explorer, user can see code, filter entering tsquery selectors and navigate thgouh matched nodes with arrow keys. finally select a node with enter.
//  *
//  * usage:
// ```
// import {astExplorer, AstExplorer} from './astExplorer'
// import {registerPrompt} from 'inquirer'
// import { tsquery } from '@phenomnomnominal/tsquery';

// registerPrompt('ast-explorer', AstExplorer as any)

// async function test(){
//   const code = `
// class Animal {
//   constructor(public name: string) { }
//   move(distanceInMeters: number = 0) {
//     console.log('hello');
//   }
// }
// class Snake extends Animal {
//   constructor(name: string) { super(name); }
//   move(distanceInMeters = 5) {
//     console.log("Slithering...");
//     super.move(distanceInMeters);
//   }
// }
//     `
//   const selectedNode= await astExplorer({code})
// console.log({selectedNode: selectedNode.getText()});
//  * })
//  * ```
//  * TODO: move to its own project
//  * TODO: pass directly all the options to the prompt - remove this function
//  */
// export async function astExplorer(options: Options): Promise<any> {
//   const columns = process.stdout.columns || 79
//   const rows = process.stdout.rows || 24
//   const choices = options.code.split('\n')
//   const result = await prompt([
//     {
//       type: 'ast-explorer',
//       name: ' ',
//       choices,
//       paginated: true,
//       pageSize: options.pageSize || Math.min(options.pageSize || Infinity, rows)
//     }
//   ])
//   return result[' ']
// }

// interface Options {
//   code: string
//   pageSize?: number
// }

// export class AstExplorer extends Base {
//   selectedNodes: Node[]
//   currentInput: string
//   sourceFile: SourceFile
//   selectedNodeIndex = 0

//   constructor(questions: Questions, rl, answers) {
//     super(questions, rl, answers)
//     if (!this.opt.choices) {
//       this.throwParamError('choices')
//     }
//     this.code = this.opt.choices.choices.map(c => c.name).join('\n')
//     const rows = process.stdout.rows || 24
//     this.min = 0
//     this.max = Math.max(this.opt.choices.choices.length, rows) - rows + 1
//     this.rawDefault = 0
//     this.currentInput = 'Identifier'
//     this.rl.line = this.currentInput
//     this.sourceFile = tsquery.ast(this.code)
//     this.selectedNodes = tsquery(this.sourceFile, this.currentInput);
//     this.selectedNodeIndex = 0
//     Object.assign(this.opt, {
//       validate: function (val) {
//         return true
//       }
//     })
//     this.opt.default = null
//     this.paginator = new CustomPaginator(this.screen)
//   }
//   /**
//    * When user press a key
//    */
//   onKeypress(e?: any) {
//     this.currentInput = '' + this.rl.line
//     this.render()
//   }
//   /**
//    * Start the Inquiry session
//    * @param  {Function} cb      Callback when prompt is done
//    * @return {this}
//    */
//   _run(cb) {
//     this.done = cb
//     const events = observe(this.rl)
//     const submit = events.line.pipe(map(this.getCurrentValue.bind(this)))
//     const validation = this.handleSubmitEvents(submit)
//     validation.success.forEach(this.onEnd.bind(this))
//     validation.error.forEach(this.onError.bind(this))
//     events.keypress.pipe(takeUntil(validation.success)).forEach(this.onKeypress.bind(this))
//     events.normalizedUpKey.pipe(takeUntil(events.line)).forEach(this.onUpKey.bind(this))
//     events.normalizedDownKey.pipe(takeUntil(events.line)).forEach(this.onDownKey.bind(this))
//     this.render()
//     return this
//   }
//   render(error?: string) {
//     let message = ''
//     const bottomContent = ''
//     const choicesStr = this.renderChoices()
//     message += this.paginator.paginate(choicesStr, this.selected, this.opt.pageSize)
//     message += this.currentInput
//     this.screen.render(message, bottomContent)
//   }
//   /**
//    * When user press `enter` key
//    */
//   getCurrentValue() {
//     return this.selectedNodes[this.selectedNodeIndex]
//   }
//   /**
//    * @param  {Number} pointer Position of the pointer
//    * @return {String}         Rendered content
//    */
//   protected renderChoices() {
//     let text = this.sourceFile.getFullText()
//     try {
//       this.selectedNodes = tsquery(this.sourceFile, this.currentInput);
//     } catch (error) {

//     }
//     this.selectedNodeIndex < this.selectedNodes.length - 1 ? this.selectedNodeIndex : 0
//     let output = ''
//     let last = 0
//     this.selectedNodes.forEach((node, i) => {
//       const nodeText = node.getFullText()
//       const painted = this.selectedNodeIndex === i ? chalk.red(nodeText) : chalk.blue(nodeText)
//       output = output += text.substring(last, node.getFullStart()) + painted
//       last = node.getEnd()
//     })
//     output += text.substring(last, text.length)
//     return output
//   }
//   onEnd(state) {
//     this.status = 'answered'
//     this.answer = state.value
//     this.render()
//     this.screen.done()
//     this.done(state.value)
//   }
//   onError() {
//     this.render('Please enter a valid index')
//   }
//   onUpKey() {
//     this.onArrowKey('up')
//   }
//   onDownKey() {
//     this.onArrowKey('down')
//   }
//   /**
//    * @param {String} type Arrow type: up or down
//    */
//   onArrowKey(type: string) {
//     if (type === 'up') this.selectedNodeIndex = this.selectedNodeIndex <= 0 ? 0 : this.selectedNodeIndex - 1
//     else this.selectedNodeIndex = this.selectedNodeIndex >= this.selectedNodes.length - 1 ? this.selectedNodes.length - 1 : this.selectedNodeIndex + 1
//     this.onKeypress()
//   }
// }

// /**
//  * Adapted from inquirer sources. 
//  * The paginator keeps track of a pointer index in a list and returns
//  * a subset of the choices if the list is too long.
//  */
// class CustomPaginator {
//   pointer: number
//   lastIndex: number
//   screen: any
//   constructor(screen?: any) {
//     this.pointer = 0
//     this.lastIndex = 0
//     this.screen = screen
//   }
//   paginate(output: string, active, pageSize) {
//     pageSize = pageSize || 7
//     const middleOfList = Math.floor(pageSize / 2)
//     let lines = output.split('\n')
//     if (this.screen) {
//       lines = this.screen.breakLines(lines)
//       active = lines.splice(0, active)
//       lines = _.flatten(lines)
//     }
//     // Make sure there's enough lines to paginate
//     if (lines.length <= pageSize) {
//       return output
//     }
//     // Move the pointer only when the user go down and limit it to the middle of the list
//     if (this.pointer < middleOfList && this.lastIndex < active && active - this.lastIndex < pageSize) {
//       this.pointer = Math.min(middleOfList, this.pointer + active - this.lastIndex)
//     }
//     this.lastIndex = active
//     // Duplicate the lines so it give an infinite list look
//     const section = ['\n', ...lines].splice(active, pageSize).join('\n')
//     return section + '\n' + chalk.dim('(Navigate Nodes using arrows, type tsquery selectors to filter, enter for selecting node)')
//   }
// }
