/**
 * @fileoverview plugin is designed to detect incorrect component imports from the internals of the module and not from the public api
 * @author shevchenkooleg
 */
"use strict";

const {isPathRelative} = require('../helpers')
const micromatch = require('micromatch')
const path = require('path')

const PUBLIC_ERROR = 'PUBLIC_ERROR'
const TESTING_DATA_ERROR = 'TESTING_DATA_ERROR'

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "plugin is designed to detect incorrect component imports from the internals of the module and not from the public api",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`,
    messages: {
      [PUBLIC_ERROR]: 'Absolute imports are only allowed from Public API (index.ts/testing.ts)',
      [TESTING_DATA_ERROR]: 'It is forbidden to import data not in test files from publicApi/testing'
    },
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          },
          testFilesPatterns: {
            type: 'array',
          }
        }
      }
    ], // Add a schema if the rule has options
  },

  create(context) {
    const { alias = '', testFilesPatterns = [] } = context.options[0] ?? {}

    const avaliableLayers = {
      'entities': 'entities',
      'features': 'features',
      'pages': 'pages',
      'widgets': 'widgets'
    }


    return {
      ImportDeclaration(node){
        const value = node.source.value
        const importFrom = alias ? value.replace(`${alias}/`, '') : value
        // console.log('importFrom ',importFrom)

        if (isPathRelative(importFrom)){
          // console.log('isPathRelative(importFrom) ', true )
          return
        }

        // [entities, article, model, types]
        const segments = importFrom.split('/')
        // console.log('segments ', segments)
        const layer = segments[0]
        const slice = segments[1]

        if (!avaliableLayers[layer]) {
          return
        }

        const isImportNotFromPublicApi = segments.length > 2

        // [entities, article, testing]
        const isImportFromTestingPublicApi = segments[2] === 'testing' && segments.length < 4
        // console.log('segments[2] ', segments[2])
        // console.log('segments[2] === \'testing\' ', segments[2] === 'testing' )
        // console.log('segments.length < 4', segments.length < 4)
        // console.log('isImportFromTestingPublicApi ',isImportFromTestingPublicApi)



        if (isImportNotFromPublicApi && !isImportFromTestingPublicApi){
          // console.log('isImportNotFromPublicApi && !isCurrentFileTesting ', isImportNotFromPublicApi && !isImportFromTestingPublicApi)
          context.report({
            node,
            messageId: PUBLIC_ERROR,
            fix: ((fixer) => {
              if (alias){
                return fixer.replaceText(node.source, `'${alias}/${layer}/${slice}'`)
              }
              return fixer.replaceText(node.source, `'${layer}/${slice}'`)
            })
          })
        }


        if (isImportFromTestingPublicApi){

          const currentFilePath = context.getFilename()
          const normalizedPath = path.toNamespacedPath(currentFilePath)
          const isCurrentFileTesting = testFilesPatterns.some(pattern => micromatch.isMatch(normalizedPath, pattern))
          // console.log('currentFilePath ', currentFilePath)
          // console.log('testFilesPatterns ', testFilesPatterns)

          if (isImportNotFromPublicApi && !isCurrentFileTesting && isImportFromTestingPublicApi){
            // console.log('isImportNotFromPublicApi && !isCurrentFileTesting ', isImportNotFromPublicApi && !isCurrentFileTesting)
            context.report({node, messageId: TESTING_DATA_ERROR})
          }
        }
      }
    };
  },
};
