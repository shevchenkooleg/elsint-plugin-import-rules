/**
 * @fileoverview plugin is designed to detect incorrect component imports from the internals of the module and not from the public api
 * @author shevchenkooleg
 */
"use strict";

const {isPathRelative} = require('../helpers')

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "plugin is designed to detect incorrect component imports from the internals of the module and not from the public api",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ], // Add a schema if the rule has options
  },

  create(context) {
    const alias = context.options[0]?.alias || ''

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

        if (isPathRelative(importFrom)){
          return
        }

        const segment = importFrom.split('/')
        const layer = segment[0]

        if (!avaliableLayers[layer]) {
          return
        }

        const isImportNotFromPublicApi = segment.length > 2

        const report = 'Absolute imports are only allowed from Public API'

        if (isImportNotFromPublicApi){
          context.report(node, report)
        }
      }
    };
  },
};
