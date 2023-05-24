"use strict";

const path = require('path')
const {isPathRelative} = require('../helpers')

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "rule is designed to detect illegal absolute import of a component into a single module, according to the FSD methodology",
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
    return {
      ImportDeclaration(node){
        const value = node.source.value
        const importFrom = alias ? value.replace(`${alias}/`, '') : value

        const toFilename = context.getFilename()

        const report = 'Component imports within the same module should be relative'

        if (shouldBeRelative(toFilename, importFrom)){
          console.log('importFrom', importFrom)
          console.log('toFilename', toFilename)
          context.report(node, report)
        }
      }
    };
  },
};

const layers = {
  'entities': 'entities',
  'features': 'features',
  'shared': 'shared',
  'pages': 'pages',
  'widgets': 'widgets'
}

function shouldBeRelative(from, to) {

  if(isPathRelative(to)){
    return false
  }

  //example entities/Article
  const toArray = to.split('/')
  const toLayer = toArray[0] //entities
  const toSlice = toArray[1] //Article

  if (!toLayer || !toSlice || !layers[toLayer]){
    return false
  }

  const normalizedPath = path.toNamespacedPath(from)
  // console.log('normalizedPath ', normalizedPath)

  const projectFrom = normalizedPath.split('src')[1]
  // console.log('projectFrom ', projectFrom)

  const fromArray = projectFrom.split('/')
  // console.log('fromArray ', fromArray)

  const fromLayer = fromArray[1]
  const fromSlice = fromArray[2]

  if (!toLayer || !toSlice || !layers[toLayer]){
    return false
  }

  return fromSlice === toSlice && fromLayer === toLayer

}