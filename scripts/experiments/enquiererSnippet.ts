const semver = require('semver');
import  { Snippet } from 'enquirer'

const snippet = new Snippet ({
  name: 'username',
  message: 'Fill out the fields in package.json',
  required: true,
  fields: [
    {
      name: 'author_name',
      message: 'Author Name',
      validate(value:string, state:any, item:any, index:number) {
        if (item && item.name === 'author_name' && ['a', 'b']) {
          return snippet.styles.danger('Author name must be "a" or "b');
        }
        return true;
      }
    },
    {
      name: 'version',
      validate(value, state, item, index) {
        if (item && item.name === 'version' && !semver.valid(value)) {
          return snippet.styles.danger('version should be a valid semver value');
        }
        return true;
      }
    }
  ],
  template: `{
  "name": "\${name}",
  "description": "\${description}",
  "version": "\${version}",
  "homepage": "https://github.com/\${username}/\${name}",
  "author": "\${author_name} (https://github.com/\${username})",
  "repository": "\${username}/\${name}",
  "license": "\${license:ISC}"
}
`
});

snippet.run()
  .then(answer => console.log('Answer:', answer.result))
  .catch(console.error);