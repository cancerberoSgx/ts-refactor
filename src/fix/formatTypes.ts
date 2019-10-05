import { enumKeys } from 'misc-utils-of-mine-generic'
import { FixOptions } from '../fix'

interface FormatCodeSettings {
  ensureNewLineAtEndOfFile?: boolean
  insertSpaceAfterCommaDelimiter?: boolean
  insertSpaceAfterSemicolonInForStatements?: boolean
  insertSpaceBeforeAndAfterBinaryOperators?: boolean
  insertSpaceAfterConstructor?: boolean
  insertSpaceAfterKeywordsInControlFlowStatements?: boolean
  insertSpaceAfterFunctionKeywordForAnonymousFunctions?: boolean
  insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis?: boolean
  insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets?: boolean
  insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces?: boolean
  insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces?: boolean
  insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces?: boolean
  insertSpaceAfterTypeAssertion?: boolean
  insertSpaceBeforeFunctionParenthesis?: boolean
  placeOpenBraceOnNewLineForFunctions?: boolean
  placeOpenBraceOnNewLineForControlBlocks?: boolean
  insertSpaceBeforeTypeAnnotation?: boolean
  indentMultiLineObjectLiteralBeginningOnBlankLine?: boolean
  baseIndentSize?: number
  indentSize?: number
  tabSize?: number
  newLineCharacter?: string
  convertTabsToSpaces?: boolean
  indentStyle?: IndentStyle
}

enum IndentStyle {
  None = 0,
  Block = 1,
  Smart = 2
}

interface UserPreferences {
  disableSuggestions?: boolean
  quotePreference?: 'auto' | 'double' | 'single'
  includeCompletionsForModuleExports?: boolean
  includeCompletionsWithInsertText?: boolean
  importModuleSpecifierPreference?: 'relative' | 'non-relative'
  /** Determines whether we import `foo/index.ts` as "foo", "foo/index", or "foo/index.js" */
  importModuleSpecifierEnding?: 'minimal' | 'index' | 'js'
  allowTextChangesInNewFiles?: boolean
  providePrefixAndSuffixTextForRename?: boolean
}

interface CustomFormatSettings {
  /**
   * If not defined it won't do any action.
   */
  trailingSemicolon?: 'never' | 'always' | 'detect'
}

export interface AllFormatCodeSettings extends FormatCodeSettings, UserPreferences, CustomFormatSettings {}

enum AllCodeFormatCodeSettingsNames {
  ensureNewLineAtEndOfFile = 'ensureNewLineAtEndOfFile',
  insertSpaceAfterCommaDelimiter = 'insertSpaceAfterCommaDelimiter',
  insertSpaceAfterSemicolonInForStatements = 'insertSpaceAfterSemicolonInForStatements',
  insertSpaceBeforeAndAfterBinaryOperators = 'insertSpaceBeforeAndAfterBinaryOperators',
  insertSpaceAfterConstructor = 'insertSpaceAfterConstructor',
  insertSpaceAfterKeywordsInControlFlowStatements = 'insertSpaceAfterKeywordsInControlFlowStatements',
  insertSpaceAfterFunctionKeywordForAnonymousFunctions = 'insertSpaceAfterFunctionKeywordForAnonymousFunctions',
  insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis = 'insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis',
  insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets = 'insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets',
  insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces = 'insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces',
  insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces = 'insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces',
  insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces = 'insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces',
  insertSpaceAfterTypeAssertion = 'insertSpaceAfterTypeAssertion',
  insertSpaceBeforeFunctionParenthesis = 'insertSpaceBeforeFunctionParenthesis',
  placeOpenBraceOnNewLineForFunctions = 'placeOpenBraceOnNewLineForFunctions',
  placeOpenBraceOnNewLineForControlBlocks = 'placeOpenBraceOnNewLineForControlBlocks',
  insertSpaceBeforeTypeAnnotation = 'insertSpaceBeforeTypeAnnotation',
  indentMultiLineObjectLiteralBeginningOnBlankLine = 'indentMultiLineObjectLiteralBeginningOnBlankLine',
  baseIndentSize = 'baseIndentSize',
  indentSize = 'indentSize',
  tabSize = 'tabSize',
  newLineCharacter = 'newLineCharacter',
  convertTabsToSpaces = 'convertTabsToSpaces',
  indentStyle = 'indentStyle',

  disableSuggestions = 'disableSuggestions',
  quotePreference = 'quotePreference',
  includeCompletionsForModuleExports = 'includeCompletionsForModuleExports',
  includeCompletionsWithInsertText = 'includeCompletionsWithInsertText',
  importModuleSpecifierPreference = 'importModuleSpecifierPreference',
  importModuleSpecifierEnding = 'importModuleSpecifierEnding',
  allowTextChangesInNewFiles = 'allowTextChangesInNewFiles',
  providePrefixAndSuffixTextForRename = 'providePrefixAndSuffixTextForRename',

  trailingSemicolon = 'trailingSemicolon'
}

export const allFormatCodeSettingsNames = enumKeys(AllCodeFormatCodeSettingsNames)

export interface FixWithFormatCodeSettingOptions extends FixOptions {
  formatCodeSettings?: AllFormatCodeSettings
}

// enum UserPreferencesNames {
//   disableSuggestions = 'disableSuggestions',
//   quotePreference = 'quotePreference',
//   includeCompletionsForModuleExports = 'includeCompletionsForModuleExports',
//   includeCompletionsWithInsertText = 'includeCompletionsWithInsertText',
//   importModuleSpecifierPreference = 'importModuleSpecifierPreference',
//   /** Determines whether we import `foo/index.ts` as "foo", "foo/index", or "foo/index.js" */
//   importModuleSpecifierEnding = 'importModuleSpecifierEnding',
//   allowTextChangesInNewFiles = 'allowTextChangesInNewFiles',
//   providePrefixAndSuffixTextForRename = 'providePrefixAndSuffixTextForRename'
// }

// const userPreferences = getEnumKeys(UserPreferencesNames)

// enum FormatCodeSettingsNames {
//   ensureNewLineAtEndOfFile = 'ensureNewLineAtEndOfFile',
//   insertSpaceAfterCommaDelimiter = 'insertSpaceAfterCommaDelimiter',
//   insertSpaceAfterSemicolonInForStatements = 'insertSpaceAfterSemicolonInForStatements',
//   insertSpaceBeforeAndAfterBinaryOperators = 'insertSpaceBeforeAndAfterBinaryOperators',
//   insertSpaceAfterConstructor = 'insertSpaceAfterConstructor',
//   insertSpaceAfterKeywordsInControlFlowStatements = 'insertSpaceAfterKeywordsInControlFlowStatements',
//   insertSpaceAfterFunctionKeywordForAnonymousFunctions = 'insertSpaceAfterFunctionKeywordForAnonymousFunctions',
//   insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis = 'insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis',
//   insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets = 'insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets',
//   insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces = 'insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces',
//   insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces = 'insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces',
//   insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces = 'insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces',
//   insertSpaceAfterTypeAssertion = 'insertSpaceAfterTypeAssertion',
//   insertSpaceBeforeFunctionParenthesis = 'insertSpaceBeforeFunctionParenthesis',
//   placeOpenBraceOnNewLineForFunctions = 'placeOpenBraceOnNewLineForFunctions',
//   placeOpenBraceOnNewLineForControlBlocks = 'placeOpenBraceOnNewLineForControlBlocks',
//   insertSpaceBeforeTypeAnnotation = 'insertSpaceBeforeTypeAnnotation',
//   indentMultiLineObjectLiteralBeginningOnBlankLine = 'indentMultiLineObjectLiteralBeginningOnBlankLine',
//   baseIndentSize = 'baseIndentSize',
//   indentSize = 'indentSize',
//   tabSize = 'tabSize',
//   newLineCharacter = 'newLineCharacter',
//   convertTabsToSpaces = 'convertTabsToSpaces',
//   indentStyle = 'indentStyle'
// }
// const formatCodeSettingsNames = getEnumKeys(FormatCodeSettingsNames)
