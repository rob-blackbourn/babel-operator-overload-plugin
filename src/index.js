const BinaryOperatorMap = {
    '+': '__add__',
    '-': '__sub__',
    '*': '__mul__',
    '/': '__div__',
    '%': '__mod__'
}

module.exports = function({ types: t }) {
    return {
        visitor: {

            Program(path) {
                console.log("Program")
                path.unshiftContainer('body', t.importDeclaration([], t.stringLiteral('operator-overload-polyfills')))
            },

            BinaryExpression (path) {
                if (path.node.hasOwnProperty('_fromTemplate')) return

                const functionName = BinaryOperatorMap[path.node.operator]
                if (!functionName) {
                    return
                }

                console.log("BinaryExpression")

                path.replaceWith(
                    t.callExpression(
                        t.memberExpression(
                            path.node.left,
                            t.identifier(functionName),
                            false),
                        [path.node.right]))
            }
        }
    }
}