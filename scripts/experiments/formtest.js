const { Form } = require('enquirer');
 
const prompt = new Form({
  name: 'user',
  message: 'Please provide the following information:',
  choices: [
    { name: 'firstname', message: 'First Name', initial: 'Jon' },
   {
     type: 'select',
  name: 'flavor',
  message: 'Pick your favorite flavor',
  limit: 10,
  choices: [
    'Almond',
    'Apple',
    'Banana',
  ]
},
    { name: 'lastname', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname1', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname2', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname3', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname4', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname5', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname8', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname7', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname9', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname51', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname52', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname53', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname54', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname55', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'lastname56', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'username', message: 'GitHub username', initial: 'jonschlinkert' }
  ]
});
 
prompt.run()
  .then(value => console.log('Answer:', value))
  .catch(console.error);