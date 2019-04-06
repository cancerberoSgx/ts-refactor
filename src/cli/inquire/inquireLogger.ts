export function uiLog(msg: string) {
  if (!ui) {
    ui = new (require('inquirer').ui.BottomBar as any)()
  }
  // setTimeout(() => {
  ui!.log.write(msg)
  // }, 1220);
}

var ui: any // cannot type this - it breaks typescript 3.4.1... // :uiT.BottomBar|undefined
