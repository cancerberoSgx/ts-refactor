import { ui as uiT } from 'inquirer'
export function uiLog(...args: any[]) {
  setTimeout(() => ui.log.write(JSON.stringify(args)), 300)
}
var ui = new uiT.BottomBar()
