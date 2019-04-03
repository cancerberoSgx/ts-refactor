import { categories, CATEGORY } from '../../category'
import { prompt } from 'inquirer'

export async function inquireCategory(): Promise<CATEGORY> {
  const answers = await prompt<{ category: CATEGORY }>({
    name: 'category',
    type: 'list',
    message: 'Which kind of fix?',
    choices: categories.map(c => ({
      name: c,
      value: c
    }))
  })
  //TODO: verify its CATEGORY?
  return answers.category
}
