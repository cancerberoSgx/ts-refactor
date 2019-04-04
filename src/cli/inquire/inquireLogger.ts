import { ui as uiT } from 'inquirer'
function log(...args: any[]) {
  setTimeout(() => ui.log.write(JSON.stringify(args)), 300)
}
var ui = new uiT.BottomBar()
