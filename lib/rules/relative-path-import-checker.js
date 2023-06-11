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
    fixable: 'code', // Or `code` or `whitespace`
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

        if (shouldBeRelative(toFileName, importFrom)){
          context.report({
            node,
            message: 'Component imports within the same module should be relative',
            fix: (fixer)=>{
              const normalizedPathTo = getNormalizedCurrenFilePath(toFileName)
                  .split('/')
                  .slice(0, -1)
                  .join('/')

              let relativePath = path.relative(normalizedPathTo, `/${importFrom}`)
              if(!relativePath.startsWith('.')){
                relativePath = './'+relativePath
              }

              return fixer.replaceText(node.source, `"${relativePath}"`)
            }
          })
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

function getNormalizedCurrenFilePath(currentFilePath){

  const normalizedPath = path.toNamespacedPath(currentFilePath)
  const projectTo= normalizedPath.split('src')[1]
  return projectTo
}

function shouldBeRelative(to, from) {

  if(!to.split('/').includes('src')){
    return false
  }

  if(isPathRelative(from)){
    return false
  }

  const fromArray = from.split('/')
  const fromLayer = fromArray[0] //entities
  const fromSlice = fromArray[1] //Article

  if (!fromLayer || !fromSlice || !layers[fromLayer]){
    return false
  }

  const projectTo = getNormalizedCurrenFilePath(to)

  const toArray = projectTo.split('/')

  const toLayer = toArray[1]

  const toSlice = toArray[2]


  return toSlice === fromSlice && toLayer === fromLayer

}