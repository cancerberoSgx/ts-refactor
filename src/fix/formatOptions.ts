export interface FormatOptionsMember {
    signature: string
    name?: string
    typeText?: string
    optional?: boolean
    jsDocsText?: string
    markdown?: string
}

export interface FormatOptions {
    name: string,
    properties: FormatOptionsMember[]
}

export const formatOptions: FormatOptions = {
    name: 'formatOptions',
    properties: [
        {
            "name": "verifyErrors",
            "signature": "verifyErrors?: 'all' | 'syntactical' | 'semantical'",
            "typeText": "\"all\" | \"syntactical\" | \"semantical\" | undefined",
            "optional": true,
            "jsDocsText": ""
        },
        {
            "name": "_projectManipulationSet",
            "signature": "_projectManipulationSet?: boolean",
            "typeText": "boolean | undefined",
            "optional": true,
            "jsDocsText": ""
        },
        {
            "name": "quotePreference",
            "signature": "quotePreference?: Quote",
            "typeText": "\"auto\" | \"double\" | \"single\" | undefined",
            "optional": true,
            "jsDocsText": ""
        },
        {
            "name": "trailingSemicolons",
            "signature": "trailingSemicolons?: 'never' | 'always'",
            "typeText": "\"never\" | \"always\" | undefined",
            "optional": true,
            "jsDocsText": ""
        },
        {
            "name": "file",
            "signature": "file: SourceFile",
            "typeText": "import(\"/Users/sebastiangurin/git/typescript-plugins-of-mine/ts-simple-ast-extra/node_modules/ts-morph/dist-declarations/ts-morph\").SourceFile",
            "optional": false,
            "jsDocsText": ""
        },
        {
            "name": "project",
            "signature": "project: Project",
            "typeText": "import(\"/Users/sebastiangurin/git/typescript-plugins-of-mine/ts-simple-ast-extra/node_modules/ts-morph/dist-declarations/ts-morph\").Project",
            "optional": false,
            "jsDocsText": ""
        },
        {
            "name": "emptyLinesMax",
            "signature": "emptyLinesMax?: number",
            "typeText": "number | undefined",
            "optional": true,
            "jsDocsText": "Maximum number of continuos empty lines allowed. "
        },
        {
            "name": "emptyLinesTrim",
            "signature": "emptyLinesTrim?: boolean",
            "typeText": "boolean | undefined",
            "optional": true,
            "jsDocsText": "Trim lines first in order to assert they are empty."
        },
        {
            "name": "formatJsdocs",
            "signature": "formatJsdocs?: boolean",
            "typeText": "boolean | undefined",
            "optional": true,
            "jsDocsText": ""
        },
        {
            "name": "formatJsdocsFormatBefore",
            "signature": "formatJsdocsFormatBefore?: boolean",
            "typeText": "boolean | undefined",
            "optional": true,
            "jsDocsText": ""
        },
        {
            "name": "formatJsdocsFormatAfter",
            "signature": "formatJsdocsFormatAfter?: boolean",
            "typeText": "boolean | undefined",
            "optional": true,
            "jsDocsText": ""
        },
        {
            "name": "jsdocLineMaxLength",
            "signature": "jsdocLineMaxLength?: number",
            "typeText": "number | undefined",
            "optional": true,
            "jsDocsText": ""
        }
    ]
}
