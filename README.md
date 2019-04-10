CLI interactive TypeScript refactor tool

# Design first thoughts

## interactive

 * all arguments are optional, if not provided they will be inquired

Example:

```sh
$ ts-refactor fix src/foo/bar.ts
Choose a fix for src/foo/bar.ts:
 · implement interface
 · fix missing imports
 · infer type form usage  # <-- user select this one 
Select code to fix: # (1)
 · Parameter Foo#bar#param1
 · Variable foo

```


## categorized fixes

### convert

it will convert code that is not necessarily incorrect to an equivalent code. 

Examples: remove/add braces to arrow functions, convert namespaced imports to named imports (and vice versa)

### fix

it will fix an existing error. 

Examples: implement interface, fix missing imports, etc

### move

### remove 

file, declarations like classes, interfaces, functions, variable, parameters, etc. 

### rename

renames a file or declaration or variable, etc

## easy CLI

ts-refactor convert organizeImports src/foo/foo.ts
ts-refactor move declaration FooImpl src/foo/impl.ts src/bar/bar.ts


## TODO

 * all rename refactors should support template name based on previous name, current folder/path. example ts-refactor rename ""
 COMBO: replaceLiteralValue, addStatement and "code fix template arguments" - see below. 
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
 * print the equivalent non interactive command on finish
 * be able to load fix options from a .json file (format code settings)
 * apply more than one codefix by cli args: ts-refactor organizeImports,removeUnused ./src --dontConfirm
 * --dontAsk should throw if something is missing
 * move the inquire inputFiles implementation to FixClasses (SimpleFix)
 * TODO: move lessPrompt.ts to its own project
 * todo: organizeImports : userpreferences
 * movedeclaration: accept declaration name as parameter.
 * stringConcatenationToTemplate: mode as param - or perhaps divide in two refactors.
 * move  declaration issue with three files simple
 * moveDeclaration should support target non existing file and in that case create it
 * add fuzze to inquireFiles https://github.com/faressoft/inquirer-checkbox-plus-prompt

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