

[![Build Status](https://travis-ci.org/cancerberosgx/ts-refactor.png?branch=master)](https://travis-ci.org/cancerberosgx/ts-refactor)

CLI interactive TypeScript refactor tool. 

WIP / RESEARCH


# Examples

## Organize imports

```
npx ts-refactor organizeImports \"src/**/*.ts*\" \"spec/**/*.ts*\" \"probes/**/*.ts*\" --dontAsk
```

## Format code

```
npx ts-refactor format \"src/**/*.ts*\" \"spec/**/*.ts*\" \
  \"probes/**/*.ts*\" ./formatCodeSettings.json --tsConfigPath \
  ./tsconfig.json --dontAsk
```

## TODO / STATUS / ROADMAP

[TODO.md](TODO.md)


# Design first thoughts (OLD)

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

