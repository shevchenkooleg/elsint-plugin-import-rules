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
          // console.log('importFrom', importFrom)
          // console.log('toFileName', toFileName)
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

  // console.log('to', to)
  // console.log('from ',from)

  if(isPathRelative(from)){
    return false
  }

  //example entities/Article
  const fromArray = from.split('/')
  // console.log('fromArray ',fromArray)
  const fromLayer = fromArray[0] //entities
  // console.log('fromLayer ', fromLayer)
  const fromSlice = fromArray[1] //Article
  // console.log('fromSlice ', fromSlice)

  if (!fromLayer || !fromSlice || !layers[fromLayer]){
    return false
  }

  const normalizedPath = path.toNamespacedPath(to)
  // console.log('normalizedPath ', normalizedPath)

  const projectTo= normalizedPath.split('src')[1]
  // console.log('projectTo ', projectTo)

  const toArray = projectTo.split('/')
  // console.log('toArray ', toArray)

  const toLayer = toArray[1]
  // console.log('toLayer ',toLayer)

  const toSlice = toArray[2]
  // console.log('toSlice ', toSlice)


  return toSlice === fromSlice && toLayer === fromLayer

}