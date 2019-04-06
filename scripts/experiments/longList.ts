
import {registerPrompt,  prompt, ui} from 'inquirer'
// import *  as ansi from 'ansi-escape-sequences'

'use strict';
/**
 * `rawlist` type prompt
 */

// var _ = require('lodash');
// var chalk = require('chalk');
var { map, takeUntil } = require('rxjs/operators')//.operators;
var Base = require('inquirer/lib/prompts/base');
var Separator = require('inquirer/lib/objects/separator');
var observe = require('inquirer/lib/utils/events');
var Paginator = require('inquirer/lib/utils/paginator');

// const c = ui.UI
class LongText extends Base{
  constructor(questions, rl, answers) {
    super(questions, rl, answers);

    if (!this.opt.choices) {
      this.throwParamError('choices');
    }
    this.opt.validChoices = this.opt.choices.filter(Separator.exclude);
    this.selected = 0;
    this.rawDefault = 0;

    Object.assign(this.opt, {
      validate: function(val) {return true
        // return val != null;
      }
    });

    // var def = this.opt.default;
    // if (_.isNumber(def) && def >= 0 && def < this.opt.choices.realLength) {
    //   this.selected = def;
    //   this.rawDefault = def;
    // } else if (!_.isNumber(def) && def != null) {
    //   let index = _.findIndex(this.opt.choices.realChoices, ({ value }) => value === def);
    //   let safeIndex = Math.max(index, 0);
    //   this.selected = safeIndex;
    //   this.rawDefault = safeIndex;
    // }

    // Make sure no default is set (so it won't be printed)
    this.opt.default = null;

    this.paginator = new Paginator();
  }

  /**
   * Start the Inquiry session
   * @param  {Function} cb      Callback when prompt is done
   * @return {this}
   */

  _run(cb) {
    this.done = cb;

    // Once user confirm (enter key)
    var events = observe(this.rl);
    var submit = events.line.pipe(map(this.getCurrentValue.bind(this)));

    var validation = this.handleSubmitEvents(submit);
    validation.success.forEach(this.onEnd.bind(this));
    validation.error.forEach(this.onError.bind(this));

    events.keypress
      .pipe(takeUntil(validation.success))
      .forEach(this.onKeypress.bind(this));
    events.normalizedUpKey.pipe(takeUntil(events.line)).forEach(this.onUpKey.bind(this));
    events.normalizedDownKey
      .pipe(takeUntil(events.line))
      .forEach(this.onDownKey.bind(this));

    // Init the prompt
    this.render();

    return this;
  }

  /**
   * Render the prompt to screen
   * @return {RawListPrompt} self
   */
  render(error?) {
    // Render question
    var message = ''//this.getQuestion();
    var bottomContent = '';
    // if (this.status === 'answered') {
      // message += this.answer
      // message += chalk.gray(this.anser);
    // } else {
      var choicesStr = renderChoices(this.opt.choices, this.selected);
      message += this.paginator.paginate(choicesStr, this.selected, this.opt.pageSize);
      // message += '\n  Answer: ';
    // }

    message += this.rl.line;
    // if (error) {
    //   bottomContent = '\n' + chalk.red('>> ') + error;
    // }
    this.screen.render(message, bottomContent);
  }

  /**
   * When user press `enter` key
   */
  getCurrentValue(index) {
    if (index == null || index === '') {
      index = this.rawDefault;
    } else {
      index -= 1;
    }
    var choice = this.opt.choices.getChoice(index);
    return choice ? choice.value : null;
  }

  onEnd(state) {
    this.status = 'answered';
    this.answer = state.value;
    // Re-render prompt
    this.render();
    this.screen.done();
    this.done(state.value);
  }

  onError() {
    this.render('Please enter a valid index');
  }

  /**
   * When user press a key
   */
  onKeypress() {
    // if(this.rl.line.trim().toLowerCase()==='q'){
    //   this.selected = 0
    // }
    var index = this.rl.line.length ? Number(this.rl.line) - 1 : 0;
    // if (this.opt.choices.getChoice(index)) {
      this.selected = index;
      // this.selected = 0
    // } else {
      // this.seleCcted = undefined;
    // }
    this.render();
  }

  /**
   * When user press up key
   */
  onUpKey() {
    this.onArrowKey('up');
  }

  /**
   * When user press down key
   */
  onDownKey() {
    this.onArrowKey('down');
  }

  /**
   * When user press up or down key
   * @param {String} type Arrow type: up or down
   */
  onArrowKey(type) {
    var index = this.rl.line.length ? Number(this.rl.line) - 1 : 0;
    if (type === 'up') index = index === 0 ? 0 : index-1//this.opt.choices.length - 1 : index - 1;
    else index = index === this.opt.choices.length - 1 ? this.opt.choices.length - 1 : index + 1;
    this.rl.line = String(index + 1);
    this.onKeypress();
  }
}

/**
 * Function for rendering list choices
 * @param  {Number} pointer Position of the pointer
 * @return {String}         Rendered content
 */
function renderChoices(choices, pointer) {
  var output = '';
  var separatorOffset = 0;
  choices.forEach(function(choice, i) {
    output += '\n';
    if (choice.type === 'separator') {
      separatorOffset++;
      output += ' ' + choice;
      return;
    }
    // var index = i - separatorOffset;
    var display = choice.name//index + 1 + ') ' + choice.name;
    // if (index === pointer) {
      // display =chalk.gray(display);
    // }
    output += display;
  });
  return output;
}

// module.exports = RawListPrompt;
// registerPrompt('long-text', LongText as any)
// async function f(){
// await prompt([{
//   type: 'long-text', 
//   name: ' ',
//   choices: ['123akjs hdkjah sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj' , '88888akjs hdkjah sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj', '777777akjs hdkjah sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj', '99999akjs hdkjah sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj', '133331akjs hdkjah sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj sjkd akjsh dkjah sdkj ahksjdh kajsh dkajshdkjahsdkja hskdj haks dj']
//   ,

//   prefix: 'Long text example',
//   paginated: true,
//   pageSize: 2,
// validate(input){
//   return true
// }
// }],

// )
// }

interface Options {
  text: string, pageSize?: number, prefix?: string, postfix?: string
}
registerPrompt('long-text', LongText as any)
export function less(options: Options): Promise<any>{
return prompt([{
  type: 'long-text', 
  name: ' ',
  choices: options.text.split('\n'),
  prefix: options.prefix||'',
  paginated: true,
  pageSize: options.pageSize||4,
  validate(input){
    return true
  }
}],

)
}

less({text: `asdasd
shelljs - npm
https://www.npmjs.com/package/shelljs
Traducir esta página
13 nov. 2018 - Portable Unix shell commands for Node.js. ... glob module. For less-commonly used commands and features, please check out our wiki page.
Can I pipe my node.js script output in to \`less\` without typing ...
https://stackoverflow.com/.../can-i-pipe-my-node-js-script-output-...
Traducir esta página
3 respuestas
26 may. 2017 - Yes, you can pipe the output of your node program into the input less via the ... they can be super-dirty, # though, and mutating shell-command lines without a ...
Execute and get the output of a shell command in node.js	17 de julio de 2018
How do use nodejs childprocess exec to run the unix ...	29 de enero de 2016
Node.js lessc not defined	19 de septiembre de 2014
node.js execute system command synchronously	17 de noviembre de 2011
Más resultados de stackoverflow.com
Execute A Unix Command With Node.js - DZone Web Dev
https://dzone.com/articles/execute-unix-command-nodejs
Traducir esta página
15 ago. 2010 - Ever wanted to use JavaScript to execute commands in good ol' Unix? Now you can. There's a fuller snippet and a more concise method.
Lessc command line issues · Issue #3216 · less/less.js · GitHub
https://github.com/less/less.js/issues/3216
Traducir esta página
3 jun. 2018 - Node: 10.3.0 ... lessc x.x.x (Less Compiler) [JavaScript] .... /usr/bin/less is a UNIX shell utility (having nothing to do with CSS) - that utility is the ...
GitHub - dthree/cash: Cross-platform Linux commands in ES6
https://github.com/dthree/cash
Traducir esta página
Cash is a cross-platform implementation of Unix shell commands written in ... implementation of the most used Unix-based commands in pure JavaScript and ... alias; cat; clear; cd; cp; echo; export; false; grep; head; kill; less; ls; mkdir; mv ... Node package that implements UNIX shell commands programatically in JavaScript.
command line - Compile .less files into .css after every update ...
https://askubuntu.com/.../compile-less-files-into-css-after-every-u...
Traducir esta página
3 respuestas
25 sep. 2013 - Simply put, the -w argument doesn't exist. $ lessc --help usage: lessc [option option=parameter ...] <source> [destination] If source is set to ...
pipe - How can I stop following output in ...	3 respuestas	17 de abril de 2017
command line - Killall node not killing ...	6 respuestas	13 de febrero de 2017
command line - How do i install less css ...	4 respuestas	26 de agosto de 2015
ruby - How do you install less css command ...	5 respuestas	23 de julio de 2013
Más resultados de askubuntu.com
`})

