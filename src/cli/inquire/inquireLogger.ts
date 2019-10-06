/**
 * hack to print bottom line msg in inquirer components
 */
export async function uiLog(msg: string, timeout = 0) {
  if (!ui) {
    ui = new (require('inquirer').ui.BottomBar as any)()
  }
  setTimeout(() => {
    ui!.log.write(msg)
  }, timeout)
}
export function uiLogClose() {
  if (ui) {
    ui.close()
  }
}
var ui: any // cannot type this - it breaks typescript 3.4.1... // :uiT.BottomBar|undefined
