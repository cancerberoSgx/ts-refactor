export function uiLog(msg: string) {
  if (!ui) {
    ui = new (require('inquirer').ui.BottomBar as any)()
  }
  ui!.log.write(msg)
}
var ui: any // cannot type this - it breaks typescript 3.4.1... // :uiT.BottomBar|undefined
