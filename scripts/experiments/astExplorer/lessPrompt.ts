import chalk from 'chalk';
import { objects, prompt, Questions } from 'inquirer';
const { map, takeUntil } = require('rxjs/operators')
const Base = require('inquirer/lib/prompts/base')
const observe = require('inquirer/lib/utils/events')
// const wrapAnsi = require('wrap-ansi')
import { tsquery } from '@phenomnomnominal/tsquery';
import { Node, SourceFile } from 'typescript';
import * as ts from 'typescript'
import * as _ from 'lodash';

/**
 * Ast explorer, user can see code, filter entering tsquery selectors and navigate thgouh matched nodes with arrow keys. finally select a node with enter.
 *
 * usage:
 * ```
 * import {astExplorer, AstExplorer} form 'inquirer-astExplorer'
 * registerPrompt('ast-explorer', AstExplorer as any)
 * await astExplorer({code: ``
class Animal {
    constructor(public name: string) { }
    move(distanceInMeters: number = 0) {
        console.log('hello');
    }
}
class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}`
 * })
 * ```
 * TODO: move to its own project
 */
export function astExplorer(options: Options): Promise<any> {
  const columns = process.stdout.columns || 79
  const rows = process.stdout.rows || 24
  // const s = options.noWrap ? options.text : wrapAnsi(options.text, columns - 4, { trim: false, wordWrap: true })
  // const s = options.code
  const choices = options.code.split('\n')
  // console.log(choices);

  return prompt([
    {
      type: 'ast-explorer',
      name: ' ',
      choices,
      // prefix: options.prefix || '',
      paginated: true,
      pageSize: options.pageSize || Math.min(options.pageSize || Infinity, rows)
    }
  ])
}

interface Options {
  code: string
  pageSize?: number
  // prefix?: string
  // postfix?: string
  // noWrap?: boolean
}

/**
 * copied from RawList and simplified so it simulates the astExplorer unix command to scroll long texts.
 */
export class AstExplorer extends Base {

  selectedNodes: Node[]
  currentInput: string
  sourceFile: SourceFile

  constructor(questions: Questions, rl, answers) {
    super(questions, rl, answers)
    if (!this.opt.choices) {
      this.throwParamError('choices')
    }
    // console.log(this.opt.choices);
    this.code = this.opt.choices.choices.map(c => c.name).join('\n')


    // tthis.opt.choices = this.opt.choices
    const rows = process.stdout.rows || 24
    this.min = 0
    this.max = Math.max(this.opt.choices.choices.length, rows) - rows + 1
    this.selected = 0
    this.rawDefault = 0

    this.currentInput = 'Identifier'
    this.sourceFile = tsquery.ast(this.code)
    this.selectedNodes = tsquery(this.sourceFile, this.currentInput);

    Object.assign(this.opt, {
      validate: function (val) {
        return true
      }
    })
    this.opt.default = null
    this.paginator = new CustomPaginator(this.screen)
  }
  /**
   * When user press a key
   */
  onKeypress() {
    if (this.rl.line && this.rl.line.length) {
      this.currentInput = this.rl.line
      // const ast = tsquery.ast(tthis.opt.choices.join('\n'))as Node
    }
    const index = this.rl.line.length ? Number(this.rl.line) - 1 : 0
    this.selected = index
    this.render()
  }
  /**
   * Start the Inquiry session
   * @param  {Function} cb      Callback when prompt is done
   * @return {this}
   */
  _run(cb) {
    this.done = cb
    const events = observe(this.rl)
    const submit = events.line.pipe(map(this.getCurrentValue.bind(this)))
    const validation = this.handleSubmitEvents(submit)
    validation.success.forEach(this.onEnd.bind(this))
    validation.error.forEach(this.onError.bind(this))
    events.keypress.pipe(takeUntil(validation.success)).forEach(this.onKeypress.bind(this))
    events.normalizedUpKey.pipe(takeUntil(events.line)).forEach(this.onUpKey.bind(this))
    events.normalizedDownKey.pipe(takeUntil(events.line)).forEach(this.onDownKey.bind(this))
    this.render()
    return this
  }

  /**
   * Render the prompt to screen
   * @return {RawListPrompt} self
   */
  render(error?: string) {
    let message = ''
    const bottomContent = ''
    const choicesStr = this.renderChoices(this.opt.choices, this.selected)
    message += this.paginator.paginate(choicesStr, this.selected, this.opt.pageSize)
    message += this.rl.line
    this.screen.render(message, bottomContent)
  }

  /**
   * When user press `enter` key
   */
  getCurrentValue(index: string | number) {
    if (index == null || index === '') {
      index = this.rawDefault
    } else if (typeof index === 'number') {
      index -= 1
    } else {
      // TODO?
    }
    const choice = this.opt.choices.getChoice(index)
    return choice ? choice.value : null
  }

  /**
   * Function for rendering list choices
   * @param  {Number} pointer Position of the pointer
   * @return {String}         Rendered content
   */
  protected renderChoices(choices: objects.ChoiceOption[], pointer) {
    let text = this.sourceFile.getFullText()//.join('\n')
    // console.log(text);


    let output = ''
    // let offset = 0,
    let last = 0
    this.selectedNodes.forEach(node => {
      const nodeText = node.getFullText(), painted = chalk.blue(nodeText)
      output = output += text.substring(last, node.getFullStart()) + painted //+ output.substring(node.getEnd() + offset, output.length)
      // offset += painted.length -nodeText.length
      // console.log(offset);

      last = node.getEnd()// + offset
      // const {line, character} = ts.getLineAndCharact erOfPosition(this.sourceFile, node.pos)
    })
    output += text.substring(last, text.length)

    // let output = ''
    // choices.forEach(function (choice, i) {
    //   output += '\n'
    //   const display = choice.name
    //   output += display
    // })
    //@ts-ignore
    // output = this.selectedNodes.map(n=>n.text!).join(', ' )+'\n'+output


    return output
  }

  onEnd(state) {
    this.status = 'answered'
    this.answer = state.value
    this.render()
    this.screen.done()
    this.done(state.value)
  }

  onError() {
    this.render('Please enter a valid index')
  }

  /**
   * When user press up key
   */
  onUpKey() {
    this.onArrowKey('up')
  }

  /**
   * When user press down key
   */
  onDownKey() {
    this.onArrowKey('down')
  }

  /**
   * When user press up or down key
   * @param {String} type Arrow type: up or down
   */
  onArrowKey(type: string) {
    let index = this.rl.line.length ? Number(this.rl.line) - 1 : 0
    if (type === 'up') index = index <= this.min ? this.min : index - 1
    else index = index >= this.max ? this.max : index + 1
    this.rl.line = String(index + 1)
    this.onKeypress()
  }



}

/**
 * Adapted from inquirer sources. 
 * The paginator keeps track of a pointer index in a list and returns
 * a subset of the choices if the list is too long.
 */
class CustomPaginator {
  pointer: number
  lastIndex: number
  screen: any
  constructor(screen?: any) {
    this.pointer = 0
    this.lastIndex = 0
    this.screen = screen
  }
  paginate(output: string, active, pageSize) {
    pageSize = pageSize || 7
    const middleOfList = Math.floor(pageSize / 2)
    let lines = output.split('\n')
    if (this.screen) {
      lines = this.screen.breakLines(lines)
      active = lines.splice(0, active)
      lines = _.flatten(lines)
    }
    // Make sure there's enough lines to paginate
    if (lines.length <= pageSize) {
      return output
    }
    // Move the pointer only when the user go down and limit it to the middle of the list
    if (this.pointer < middleOfList && this.lastIndex < active && active - this.lastIndex < pageSize) {
      this.pointer = Math.min(middleOfList, this.pointer + active - this.lastIndex)
    }
    this.lastIndex = active
    // Duplicate the lines so it give an infinite list look
    const section = ['\n', ...lines].splice(active, pageSize).join('\n')
    return section + '\n' + chalk.dim('(Move up and down to scroll and exit with <enter>)')
  }
}
