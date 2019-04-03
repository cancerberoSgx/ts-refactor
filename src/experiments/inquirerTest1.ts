import * as inquirer from 'inquirer'
import { categories } from '../category';

async function test(){

const answer = await askCategory()

console.log(answer);


}

test()

async function askCategory() {
    return await inquirer.prompt({
        name: 'category',
        type: 'list',
        message: 'Which kind of fix?',
        choices: categories.map(c => ({
            name: c,
            value: c,
        }))
    });
}
