import { enumKeys } from 'misc-utils-of-mine-generic'
import { FixOptions } from '../fix'

interface FormatCodeSettings {
  ensureNewLineAtEndOfFile?: boolean
  readonly insertSpaceAfterCommaDelimiter?: boolean
  readonly insertSpaceAfterSemicolonInForStatements?: boolean
  readonly insertSpaceBeforeAndAfterBinaryOperators?: boolean
  readonly insertSpaceAfterConstructor?: boolean
  readonly insertSpaceAfterKeywordsInControlFlowStatements?: boolean
  readonly insertSpaceAfterFunctionKeywordForAnonymousFunctions?: boolean
  readonly insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis?: boolean
  readonly insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets?: boolean
  readonly insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces?: boolean
  readonly insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces?: boolean
  readonly insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces?: boolean
  readonly insertSpaceAfterTypeAssertion?: boolean
  readonly insertSpaceBeforeFunctionParenthesis?: boolean
  readonly placeOpenBraceOnNewLineForFunctions?: boolean
  readonly placeOpenBraceOnNewLineForControlBlocks?: boolean
  readonly insertSpaceBeforeTypeAnnotation?: boolean
  readonly indentMultiLineObjectLiteralBeginningOnBlankLine?: boolean
  readonly baseIndentSize?: number
  readonly indentSize?: number
  readonly tabSize?: number
  readonly newLineCharacter?: string
  readonly convertTabsToSpaces?: boolean
  readonly indentStyle?: IndentStyle
}

enum IndentStyle {
  None = 0,
  Block = 1,
  Smart = 2
}

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

interface UserPreferences {
  readonly disableSuggestions?: boolean
  readonly quotePreference?: 'auto' | 'double' | 'single'
  readonly includeCompletionsForModuleExports?: boolean
  readonly includeCompletionsWithInsertText?: boolean
  readonly importModuleSpecifierPreference?: 'relative' | 'non-relative'
  /** Determines whether we import `foo/index.ts` as "foo", "foo/index", or "foo/index.js" */
  readonly importModuleSpecifierEnding?: 'minimal' | 'index' | 'js'
  readonly allowTextChangesInNewFiles?: boolean
  readonly providePrefixAndSuffixTextForRename?: boolean
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

interface CustomFormatSettings {
  /**
   * If not defined it won't do any action. 
   */
  trailingSemicolon?: 'never'|'always'|'detect'
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
  /** Determines whether we import `foo/index.ts` as "foo", "foo/index", or "foo/index.js" */
  importModuleSpecifierEnding = 'importModuleSpecifierEnding',
  allowTextChangesInNewFiles = 'allowTextChangesInNewFiles',
  providePrefixAndSuffixTextForRename = 'providePrefixAndSuffixTextForRename',

  trailingSemicolon = 'trailingSemicolon'
}

export const allFormatCodeSettingsNames = enumKeys(AllCodeFormatCodeSettingsNames)

export interface FixWithFormatCodeSettingOptions extends FixOptions {
  formatCodeSettings?: AllFormatCodeSettings
}
