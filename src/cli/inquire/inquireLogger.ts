export async function uiLog(msg: string) {
  if (!ui) {
    ui = new (require('inquirer').ui.BottomBar as any)()
  }
  // setTimeout(() => {
  await ui!.log.write(msg)
  // }, 1220);
}
export function uiLogClose() {
  if (ui) {
    ui.close()
  }
}
var ui: any // cannot type this - it breaks typescript 3.4.1... // :uiT.BottomBar|undefined
