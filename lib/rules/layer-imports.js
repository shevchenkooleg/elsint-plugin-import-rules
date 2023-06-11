/**
 * @fileoverview checks the legitimacy of imports from one layer to another according to the FSD methodology
 * @author shevchenkooleg
 */
"use strict";

const {isPathRelative} = require('../helpers')
const micromatch = require('micromatch')
const path = require('path')

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "checks the legitimacy of imports from one layer to another according to the FSD methodology",
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
          },
          ignoreImportPatterns: {
            type: 'array',
          }
        }
      }
    ],
  },

  create(context) {
    const { alias = '', ignoreImportPatterns = [] } = context.options[0] ?? {}


    const layers = {
      'app': ['pages', 'features', 'entities', 'widgets', 'shared'],
      'pages': ['features', 'entities', 'widgets', 'shared'],
      'widgets': ['features', 'entities', 'shared'],
      'features': ['entities', 'shared'],
      'entities': ['entities', 'shared'],
      'shared': ['shared']
    }

    const availableLayers = {
      'app': 'app',
      'entities': 'entities',
      'features': 'features',
      'pages': 'pages',
      'widgets': 'widgets',
      'shared': 'shared'
    }

    const getImportLayer = (value) => {
      const importFrom = alias ? value.replace(`${alias}/`, '') : value
      const importPathSegments = importFrom.split('/')
      const importLayer = importPathSegments[0]
      return importLayer
    }

    const getCurrentFileLayer = (currentFilePath) => {
      const normalizedPath = path.toNamespacedPath(currentFilePath)
      const projectPath = normalizedPath.split('src')
      const currenFilePathSegments = projectPath[1].split('/').splice(1,)
      const currenFileLayer = currenFilePathSegments[0]
      return currenFileLayer
    }


    return {
      ImportDeclaration(node){
        const importPath = node.source.value
        const fromLayer = getImportLayer(importPath)
        const currentFilePath = context.getFilename()

        if(!currentFilePath.split('/').includes('src')){
          return
        }

        if (!availableLayers[fromLayer]) {
          return
        }

        const toLayer = getCurrentFileLayer(currentFilePath)

        if (!availableLayers[toLayer]){
          return
        }

        if (isPathRelative(importPath)){
          return
        }

        const isIgnored = ignoreImportPatterns.some(pattern => {
          return micromatch.isMatch(importPath, pattern)
        })

        if (isIgnored){
          return
        }

        if (!layers[toLayer]?.includes(fromLayer)){
          context.report(node, 'Layer can only import underlying layers using the FSD methodology')
        }
      }
    };
  },
};
