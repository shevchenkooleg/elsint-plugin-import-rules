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

        const toFileName = context.getFilename()

        const report = 'Component imports within the same module should be relative'

        if (shouldBeRelative(toFileName, importFrom)){
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

function shouldBeRelative(to, from) {

  if(isPathRelative(from)){
    return false
  }

  const fromArray = from.split('/')
  const fromLayer = fromArray[0] //entities
  const fromSlice = fromArray[1] //Article

  if (!fromLayer || !fromSlice || !layers[fromLayer]){
    return false
  }

  const normalizedPath = path.toNamespacedPath(to)

  const projectTo= normalizedPath.split('src')[1]

  const toArray = projectTo.split('/')

  const toLayer = toArray[1]

  const toSlice = toArray[2]


  return toSlice === fromSlice && toLayer === fromLayer

}