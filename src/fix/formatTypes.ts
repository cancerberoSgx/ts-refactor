import { enumKeys, notUndefined, RemoveProperties } from 'misc-utils-of-mine-generic'
import { FixOptions } from '../fix'
import { FormatOptions, ts } from 'ts-simple-ast-extra'
import { formatOptions } from './formatOptions'
import { never } from 'rxjs'

export interface AllFormatCodeSettings extends  RemoveProperties<FormatOptions, 'file'|'project'> { }

export interface FixWithFormatCodeSettingOptions extends FixOptions {
  formatCodeSettings?: AllFormatCodeSettings
}

export const allFormatCodeSettingsNames = formatOptions.properties!.map(o=>o.name)

export const defaultFormatOptions: Required<AllFormatCodeSettings> = {
  "insertSpaceBeforeAndAfterBinaryOperators": false,
  "insertSpaceAfterCommaDelimiter": false,
  "insertSpaceAfterSemicolonInForStatements": false,
  "insertSpaceAfterConstructor": false,
  "insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": false,
  "insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets": false,
  "insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces": false,
  "insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces": false,
  "insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces": false,
  "insertSpaceAfterTypeAssertion": false,
  "insertSpaceBeforeFunctionParenthesis": false,
  "placeOpenBraceOnNewLineForFunctions": false,
  "placeOpenBraceOnNewLineForControlBlocks": false,
  "insertSpaceBeforeTypeAnnotation": false,
  "indentMultiLineObjectLiteralBeginningOnBlankLine": false,
  "indentSize": 2,
  ensureNewLineAtEndOfFile: false, 
  insertSpaceAfterKeywordsInControlFlowStatements: false, 
  insertSpaceAfterFunctionKeywordForAnonymousFunctions: false, 
  baseIndentSize: 0,
  tabSize: 2, 
  newLineCharacter: '\n', 
  indentStyle: ts.IndentStyle.Block, 
  disableSuggestions: false,
  emptyLinesMax: 1,
  emptyLinesTrim: false,
  _projectManipulationSetted: false,
  formatJsdocs: false,
  "convertTabsToSpaces": false,
  "quotePreference": "single",
  "importModuleSpecifierPreference": "relative",
  "importModuleSpecifierEnding": "minimal",
  "allowTextChangesInNewFiles": false,
  "trailingSemicolons": 'always',
  includeCompletionsForModuleExports: true, 
  includeCompletionsWithInsertText: true, 
  providePrefixAndSuffixTextForRename: false, 
  organizeImports: true,
  verifyErrors: "syntactical", 
  formatJsdocsFormatBefore: false, formatJsdocsFormatAfter: false, jsdocLineMaxLength: 110
}