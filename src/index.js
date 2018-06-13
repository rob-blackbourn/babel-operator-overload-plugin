function createCallableMemberExpression(t, name, obj, args) {
    const expression =
        t.callExpression(
            t.memberExpression(
                obj,
                t.identifier(name),
                false),
            args)
    return expression
}

function createCallableBinaryExpression(t, name, path) {
    return createCallableMemberExpression(t, name, path.node.left, [path.node.right])
}

function createCallableUnaryExpression(t, name, path) {
    return createCallableMemberExpression(t, name, path.node.left, [])
}

const BinaryOperatorMap = {
    '+': function(t, path) { return createCallableBinaryExpression(t, '__add__', path) },
    '-': function(t, path) { return createCallableBinaryExpression(t, '__sub__', path) },
    '*': function(t, path) { return createCallableBinaryExpression(t, '__mul__', path) },
    '/': function(t, path) { return createCallableBinaryExpression(t, '__div__', path) },
    '%': function(t, path) { return createCallableBinaryExpression(t, '__mod__', path) },
    '**': function(t, path) { return createCallableBinaryExpression(t, '__pow__', path) },
    '&': function(t, path) { return createCallableBinaryExpression(t, '__and__', path) },
    '|': function(t, path) { return createCallableBinaryExpression(t, '__or__', path) },
    '^': function(t, path) { return createCallableBinaryExpression(t, '__xor__', path) },
    '<<': function(t, path) { return createCallableBinaryExpression(t, '__lshift__', path) },
    '>>': function(t, path) { return createCallableMemberExpression(t, '__rshift__', path.node.left, [path.node.right, true]) },
    '>>>': function(t, path) { return createCallableMemberExpression(t, '__rshift__', path.node.left, [path.node.right, false]) },
    '<': function(t, path) { return createCallableBinaryExpression(t, '__lt__', path) },
    '<=': function(t, path) { return createCallableBinaryExpression(t, '__le__', path) },
    '>': function(t, path) { return createCallableBinaryExpression(t, '__gt__', path) },
    '>=': function(t, path) { return createCallableBinaryExpression(t, '__ge__', path) },
    '==': function(t, path) { return createCallableBinaryExpression(t, '__eq__', path) },
    '!=': function(t, path) { return createCallableBinaryExpression(t, '__ne__', path) },
}

const UnaryOperatorMap = {
    '+': function(t, path) { return createCallableUnaryExpression(t, '__plus__', path) },
    '-': function(t, path) { return createCallableUnaryExpression(t, '__neg__', path) },
    '++': function(t, path) { return createCallableMemberExpression(t, '__incr__', path.node.left, [path.node.prefix]) },
    '--': function(t, path) { return createCallableMemberExpression(t, '__decr__', path.node.left, [path.node.prefix]) },
    '~': function(t, path) { return createCallableUnaryExpression(t, '__not__', path) },
}

const AssignmentOperatorMap = {
}

const OperatorOverloadDirectiveName = 'babel-operator-overload-plugin'

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
    return hasDirective(directives, OperatorOverloadDirectiveName, { 'enabled': true, 'disabled': false})
}

module.exports = function({ types: t }) {
    return {
        visitor: {

            Program: {
                enter(path, state) {

                    if (!state.dynamicData.hasOwnProperty(OperatorOverloadDirectiveName)) {
                        state.dynamicData[OperatorOverloadDirectiveName] = {
                            directiveCount: 0
                        }
                    }

                    if (hasOverloadingDirective(path.node.directives) !== false) {
                        ++state.dynamicData[OperatorOverloadDirectiveName].directiveCount
                        path.unshiftContainer('body', t.importDeclaration([], t.stringLiteral('operator-overload-polyfills')))
                    }
                },
                exit(path, state) {
                    if (hasOverloadingDirective(path.node.directives) !== false) {
                        --state.dynamicData[OperatorOverloadDirectiveName].directiveCount
                    }
                }
            },

            BlockStatement: {
                enter(path, state) {
                    switch (hasOverloadingDirective(path.node.directives)) {
                        case true:
                            ++state.dynamicData[OperatorOverloadDirectiveName].directiveCount
                            break
                        case false:
                            --state.dynamicData[OperatorOverloadDirectiveName].directiveCount
                            break
                    }
                },
                exit(path, state) {
                    switch (hasOverloadingDirective(path.node.directives)) {
                        case true:
                            --state.dynamicData[OperatorOverloadDirectiveName].directiveCount
                            break
                        case false:
                            ++state.dynamicData[OperatorOverloadDirectiveName].directiveCount
                            break
                    }
                }
            },

            BinaryExpression(path, state) {

                if (state.dynamicData[OperatorOverloadDirectiveName].directiveCount === 0) {
                    return
                }

                if (path.node.hasOwnProperty('_fromTemplate')) {
                    return
                }

                const factory = BinaryOperatorMap[path.node.operator]
                if (!factory) {
                    return
                }

                path.replaceWith(factory(t, path))
            },

            UnaryExpression(path, state) {

                if (state.dynamicData[OperatorOverloadDirectiveName].directiveCount === 0) {
                    return
                }

                if (path.node.hasOwnProperty('_fromTemplate')) {
                    return
                }

                const factory = UnaryOperatorMap[path.node.operator]
                if (!factory) {
                    return
                }

                path.replaceWith(factory(t, path))
            },

            AssignmentExpression(path, state) {

                if (state.dynamicData[OperatorOverloadDirectiveName].directiveCount === 0) {
                    return
                }

                if (path.node.hasOwnProperty('_fromTemplate')) {
                    return
                }

                if (path.node.operator === "=") {
                    return
                }

                const name = path.node.operator.slice(0, path.node.operator.length - 1)
                const factory = BinaryOperatorMap[name]
                if (!factory) {
                    return
                }

                const binaryExpression = factory(t, path)

                path.replaceWith(t.assignmentExpression('=', path.node.left, binaryExpression))
            }
        }
    }
}