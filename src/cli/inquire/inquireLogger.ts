// import { ui as uiT } from 'inquirer'
export function uiLog(...args: any[]) {
  if (!ui) {
    ui = new (require('inquirer').ui.BottomBar as any)()
  }
  setTimeout(() => ui!.log.write(JSON.stringify(args)), 300)
}
var ui: any // cannot typethis - it breaks typescript 3.4.1... // :uiT.BottomBar|undefined
