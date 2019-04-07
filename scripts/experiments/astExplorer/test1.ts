import {astExplorer, AstExplorer} from './astExplorer'
import {registerPrompt} from 'inquirer'
import { tsquery } from '@phenomnomnominal/tsquery';

registerPrompt('ast-explorer', AstExplorer as any)

async function test(){
  const code = `
class Animal {
  constructor(public name: string) { }
  move(distanceInMeters: number = 0) {
    console.log('hello');
  }
}
class Snake extends Animal {
  constructor(name: string) { super(name); }
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}
    `
  const selectedNode= await astExplorer({code})
console.log({selectedNode: selectedNode.getText()});


// const ast = tsquery.ast(code);
// const nodes = tsquery(ast, 'Identifier[name="Animal"]');
// console.log(nodes.length); // 2

}
test()