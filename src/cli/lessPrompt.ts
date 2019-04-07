import chalk from 'chalk';
import { objects, prompt, Questions } from 'inquirer';
import * as _ from 'lodash';

const { map, takeUntil } = require('rxjs/operators')
const Base = require('inquirer/lib/prompts/base')
const observe = require('inquirer/lib/utils/events')
const wrapAnsi = require('wrap-ansi')

/**
 * unix `less` command like prompt to render large text with pagination. WHen pressing enter it exits.
 *
 * usage:
 * ```
 * import {less, Less} form 'inquirer-less'
 * registerPrompt('less', Less as any)
 * await less({text: `long text possible with ansi styles`})
 * ```
 *
 * TODO: move to its own project
 */
export function less(options: Options): Promise<any> {
  const columns = process.stdout.columns || 79
  const rows = process.stdout.rows || 24
  const s = options.noWrap ? options.text : wrapAnsi(options.text, columns - 4, { trim: false, wordWrap: true })
  return prompt([
    {
      type: 'less',
      name: ' ',
      choices: s.split('\n'),
      prefix: options.prefix || '',
      paginated: true,
      pageSize: options.pageSize || Math.min(options.pageSize || Infinity, rows)
    }
  ])
}

interface Options {
  text: string
  pageSize?: number
  prefix?: string
  postfix?: string
  noWrap?: boolean
}

/**
 * copied from RawList and simplified so it simulates the less unix command to scroll long texts.
 */
export class Less extends Base {
  constructor(questions: Questions, rl, answers) {
    super(questions, rl, answers)
    if (!this.opt.choices) {
      this.throwParamError('choices')
    }
    this.opt.validChoices = this.opt.choices
    const rows = process.stdout.rows || 24
    this.min = 0
    this.max = Math.max(this.opt.validChoices.length, rows) - rows + 1
    this.selected = 0
    this.rawDefault = 0
    Object.assign(this.opt, {
      validate: function (val) {
        return true
      }
    })
    this.opt.default = null
    this.paginator = new CustomPaginator(this.screen)
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
    const choicesStr = renderChoices(this.opt.choices, this.selected)
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
   * When user press a key
   */
  onKeypress() {
    const index = this.rl.line.length ? Number(this.rl.line) - 1 : 0
    this.selected = index
    this.render()
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
 * Function for rendering list choices
 * @param  {Number} pointer Position of the pointer
 * @return {String}         Rendered content
 */
function renderChoices(choices: objects.ChoiceOption[], pointer) {
  let output = ''
  choices.forEach(function (choice, i) {
    output += '\n'
    const display = choice.name
    output += display
  })
  return output
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
