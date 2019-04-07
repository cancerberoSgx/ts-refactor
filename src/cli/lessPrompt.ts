import { prompt, registerPrompt } from 'inquirer'

var { map, takeUntil } = require('rxjs/operators')
var Base = require('inquirer/lib/prompts/base')
// var Separator = require('inquirer/lib/objects/separator');
var observe = require('inquirer/lib/utils/events')
// var Paginator = require('inquirer/lib/utils/paginator');

class LongText extends Base {
  constructor(questions, rl, answers) {
    super(questions, rl, answers)
    if (!this.opt.choices) {
      this.throwParamError('choices')
    }
    this.opt.validChoices = this.opt.choices //.filter(Separator.exclude);

    // const columns = process.stdout.columns || 79
    const rows = process.stdout.rows || 24

    this.min = 0 // =this.opt.validChoices.length > rows ? Math.trunc(this.opt.validChoices.length / rows)*10 : 0//this.opt.validChoices.length //Math.max(rows, this.opt.validChoices.length)
    this.max = Math.max(this.opt.validChoices.length, rows) - rows + 1 ////- this.min -2

    this.selected = 0
    this.rawDefault = 0

    Object.assign(this.opt, {
      validate: function(val) {
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
    var events = observe(this.rl)
    var submit = events.line.pipe(map(this.getCurrentValue.bind(this)))
    var validation = this.handleSubmitEvents(submit)
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
  render(error?) {
    var message = ''
    var bottomContent = ''
    var choicesStr = renderChoices(this.opt.choices, this.selected)
    message += this.paginator.paginate(choicesStr, this.selected, this.opt.pageSize)
    message += this.rl.line
    this.screen.render(message, bottomContent)
  }

  /**
   * When user press `enter` key
   */
  getCurrentValue(index) {
    if (index == null || index === '') {
      index = this.rawDefault
    } else {
      index -= 1
    }
    var choice = this.opt.choices.getChoice(index)
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
    var index = this.rl.line.length ? Number(this.rl.line) - 1 : 0
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
  onArrowKey(type) {
    var index = this.rl.line.length ? Number(this.rl.line) - 1 : 0
    if (type === 'up') index = index <= this.min ? this.min : index - 1
    //index === 0 ? 0 : index - 1
    else index = index >= this.max ? this.max : index + 1 //=== this.opt.choices.length - 1 ? this.opt.choices.length - 1 : index + 1;
    this.rl.line = String(index + 1)
    this.onKeypress()
  }
}

/**
 * Function for rendering list choices
 * @param  {Number} pointer Position of the pointer
 * @return {String}         Rendered content
 */
function renderChoices(choices, pointer) {
  var output = ''
  // var separatorOffset = 0;
  choices.forEach(function(choice, i) {
    output += '\n'
    // if (choice.type === 'separator') {
    // separatorOffset++;
    // output += ' ' + choice;
    // return;
    // }
    var display = choice.name
    output += display
  })
  return output
}

interface Options {
  text: string
  pageSize?: number
  prefix?: string
  postfix?: string
  noWrap?: boolean
}

var _ = require('lodash')
var chalk = require('chalk')

/**
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
    var middleOfList = Math.floor(pageSize / 2)
    var lines = output.split('\n')

    if (this.screen) {
      lines = this.screen.breakLines(lines)
      active =
        // _.sum(lines.map(lineParts => lineParts.length)
        lines.splice(0, active)
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

    // // Duplicate the lines so it give an infinite list look
    // var infinite = _.flatten([lines, lines, lines]);
    // var topIndex = Math.max(0, active + lines.length - this.pointer);

    var section = ['\n', ...lines].splice(active, pageSize).join('\n')
    return section + '\n' + chalk.dim('(Move up and down to scroll and exit with <enter>)')
  }
}

const wrapAnsi = require('wrap-ansi')
registerPrompt('long-text', LongText as any)

/**
 * unix `less` command like prompt to render large text with pagination. WHen pressing enter it exits. 
 * 
 * usage: 
 * ```
 * await less({text: `long text possible with ansi styles`})
 * ```
 * 
 * TODO: move to its own project

 */
export function less(options: Options): Promise<any> {
  const columns = process.stdout.columns || 79
  const rows = process.stdout.rows || 24
  // const s = options.text
  const s = options.noWrap ? options.text : wrapAnsi(options.text, columns - 4, { trim: false, wordWrap: true })

  // setTimeout(() => {
  //   uiLog(s, 100)
  // }, 2000);

  return prompt([
    {
      type: 'long-text',
      name: ' ',
      choices: s.split('\n'), //.filter(l => !!l.trim()),
      prefix: options.prefix || '',
      paginated: true,
      pageSize: options.pageSize || Math.min(options.pageSize || Infinity, rows)
      // validate(input) {
      // return true
      // }
    }
  ])
}

// console.log('Terminal size: ' + process.stdout.columns + 'x' + process.stdout.rows);

// process.stdout.columns
