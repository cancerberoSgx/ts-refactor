important

  * encapsulate API only in a separate project
  * build a CLI separately
    * ideally two CLIs one non interactive and fast and the intereactive heavier in separate repos.


## TODO
- [ ] inquireSettings : all properties are represented as booleans but there are some that are numbers or enums.
- [ ] inquireFiles and settings: add fuzzy  https://github.com/faressoft/inquirer-checkbox-plus-prompt
- [ ] json schema for formatCodeSettings.json 
- [ ] formatCodeSettings.json validation API and CLI
- [ ] all rename refactors should support template name based on previous name, current folder/path. example ts-refactor rename ""
 CO M BO: replaceLiteralValue, addStatement and "code fix template arguments" - see below. 
  - [ ] replaceLiteralValue : similar to rename but for replace literal values: ts-node replace "src/**" StringLiteral "add-to-cart". 
  - [ ] also could be a more aggresive variabt to replace any substring (useful for comments?)
  - [ ] addStatement: useful in combination with other fixes that need to add an import, comment, variable decl, "use strict", etc.
    - []for example `ts-refactor addStatement ""src/**/*" ImportSpecifier first "import {intl} from $SPECIFIER1$"`
  - [ ] code fix template argument**
    -   []previous one wont work if we cannot define what's $SPECIFIER1$ from the CLI
    - [ ] we do it in a separate argument - same command:
      -   []`ts-refactor addStatement ""src/**/*" ImportSpecifier first "import {intl} from $SPECIFIER1$" "$S P ECIFIER1$=asModuleSpecifierRelativePathTo('./src/util/Internationalization.ts')"`
    - []we create a useful couple
    - [ ] and a easy to use extension mechanism so others can be added as plugins
    - [ ] question, is "ImportSpecifier" argument really necessary?
- []pri n t the equivalent non interactive command on finish
- [ ] be able to load fix options from a .json file (format code settings)
- [ ] apply more than one codefix by cli args: ts-refactor organizeImports,removeUnused ./src --dontConfirm
- [ ] --dontAsk should throw if something is missing
- [ ] move the inquire inputFiles implementation to FixClasses (SimpleFix)
- [ ] TODO: move lessPrompt.ts to its own project
- [ ] todo: organizeImports : userpreferences
- [ ] movedeclaration: accept declaration name as parameter.
- [ ] stringConcatenationToTemplate: mode as param - or perhaps divide in two refactors.
- [ ] move  declaration issue with three files simple
- [ ] moveDeclaration should support target non existing file and in that case create it
- [ ] add fuzze to inquireFiles https://github.com/faressoft/inquirer-checkbox-plus-prompt
- [ ] `ts-refactor initFormatSettings` - will ask most important properties from codeSettings and when finish generate such file. in each step user can   go back - select default, and finish the process with defaults for the rest.
- []`` 
 
### Ideas

 * AST navigator. at some point we will need a CLI tool for advance AST node selection. I'm imagining two things: 1) query language for aproximations / filtering - tsquery should do 2) a CLI tool like lynx/links CLI browsers, when you can "navigate" links with the keyboard (tab or arrow). Our links will be match ast nodes. user can select one with space, (multiple selection needed ? ) User can type there to filter nodes with queries. Show all the text ? or just souroundings of matches ?

#### COMBO: replaceLiteralValue, addStatement and "code fix template arguments" - see below. 
   * replaceLiteralValue : similar to rename but for replace literal values: ts-node replace "src/**" StringLiteral "add-to-cart". 
    * also could be a more aggresive variabt to replace any substring (useful for comments?)
   * addStatement: useful in combination with other fixes that need to add an import, comment, variable decl, "use strict", etc.
     * for example `ts-refactor addStatement ""src/**/*" ImportSpecifier first "import {intl} from $SPECIFIER1$"`
   * **code fix template argument**
     * previous one wont work if we cannot define what's $SPECIFIER1$ from the CLI
     * we do it in a separate argument - same command:
       * `ts-refactor addStatement ""src/**/*" ImportSpecifier first "import {intl} from $SPECIFIER1$" "$SPECIFIER1$=asModuleSpecifierRelativePathTo('./src/util/Internationalization.ts')"`
     * we create a useful couple
     * and a easy to use extension mechanism so others can be added as plugins
     * question, is "ImportSpecifier" argument really necessary?