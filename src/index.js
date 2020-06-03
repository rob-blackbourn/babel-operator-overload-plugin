const babelTemplate = require('@babel/template')
const template = babelTemplate.default

const OperatorOverloadDirectiveName = 'babel-operator-overload-plugin'

function createBinaryTemplate(op) {
  return template(`
      (function (LEFT_ARG, RIGHT_ARG) {
        '${OperatorOverloadDirectiveName} disabled'
        if (LEFT_ARG !== null && LEFT_ARG !== undefined
             && LEFT_ARG[Symbol.for("${op}")])
            return LEFT_ARG[Symbol.for("${op}")](RIGHT_ARG)
        else return LEFT_ARG ${op} RIGHT_ARG
      })
  `)
}

function createUnaryTemplate(op) {
  return template(`
      (function (ARG) {
        '${OperatorOverloadDirectiveName} disabled'
        if (ARG !== null && ARG !== undefined
             && ARG[Symbol.for("${op}")])
            return ARG[Symbol.for("${op}")]()
        else return ${op}ARG
      })
  `)
}

function hasDirective(directives, name, values) {
  for (const directive of directives) {
    if (directive.value.value.startsWith(name)) {
      const setting = directive.value.value.substring(name.length).trim().toLowerCase()
      return values[setting]
    }
  }
  return undefined
}

function hasOverloadingDirective(directives) {
  return hasDirective(directives, OperatorOverloadDirectiveName, { 'enabled': true, 'disabled': false })
}

module.exports = function ({ types: t }) {
  return {
    visitor: {

      Program: {
        enter(path, state) {

          if (state.dynamicData === undefined) {
            state.dynamicData = {}
          }

          if (!state.dynamicData.hasOwnProperty(OperatorOverloadDirectiveName)) {
            state.dynamicData[OperatorOverloadDirectiveName] = {
              directives: []
            }
          }

          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(true)
              break;
            case false:
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(false)
              break;
            default:
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(state.opts.enabled == undefined ? true : state.opts.enabled)
              break;
          }
        },
        exit(path, state) {
          if (hasOverloadingDirective(path.node.directives) !== false) {
            state.dynamicData[OperatorOverloadDirectiveName].directives.shift()
          }
        }
      },

      BlockStatement: {
        enter(path, state) {
          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(true)
              break
            case false:
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(false)
              break
          }
        },
        exit(path, state) {
          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
            case false:
              state.dynamicData[OperatorOverloadDirectiveName].directives.shift()
              break
          }
        }
      },

      BinaryExpression(path, state) {

        if (!state.dynamicData[OperatorOverloadDirectiveName].directives[0]) {
          return
        }

        const expressionStatement = createBinaryTemplate(path.node.operator)({
          LEFT_ARG: path.scope.generateUidIdentifier("left"),
          RIGHT_ARG: path.scope.generateUidIdentifier("right"),
        })

        path.replaceWith(
          t.callExpression(
            expressionStatement.expression,
            [path.node.left, path.node.right]
          )
        )
      },

      UnaryExpression(path, state) {

        if (!state.dynamicData[OperatorOverloadDirectiveName].directives[0]) {
          return
        }

        const expressionStatement = createUnaryTemplate(path.node.operator)({
          ARG: path.scope.generateUidIdentifier("arg"),
        })

        path.replaceWith(
          t.callExpression(
            expressionStatement.expression,
            [path.node.argument]
          )
        )
      },

      AssignmentExpression(path, state) {

        if (!state.dynamicData[OperatorOverloadDirectiveName].directives[0]) {
          return
        }

        if (path.node.hasOwnProperty('_fromTemplate')) {
          return
        }

        if (path.node.operator === "=") {
          return
        }

        const expressionStatement = createBinaryTemplate(path.node.operator)({
          LEFT_ARG: path.scope.generateUidIdentifier("left"),
          RIGHT_ARG: path.scope.generateUidIdentifier("right"),
        })
        const expression = expressionStatement.expression

        path.replaceWith(t.assignmentExpression('=', path.node.left, expression))
      }
    }
  }
}