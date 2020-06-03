import assert from 'assert';
var babelCore = require("@babel/core");

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('Operator overloading', () => {
  const tests = [
    {
      description: 'should transpile assignment',
      operation: 'x = y',
      expectation: `"use strict";

x = y;`
    },
    {
      description: 'should transpile addition assignment',
      operation: 'x += y',
      expectation: `"use strict";

x = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for("+")]) return _left[Symbol.for("+")](_right);else return _left + _right;
}(x, y);`
    },
    {
      description: 'should transpile subtraction assignment',
      operation: 'x -= y',
      expectation: `"use strict";

x = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for("-")]) return _left[Symbol.for("-")](_right);else return _left - _right;
}(x, y);`
    },
    {
      description: 'should transpile multiplication assignment',
      operation: 'x *= y',
      expectation: `"use strict";

x = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for("*")]) return _left[Symbol.for("*")](_right);else return _left * _right;
}(x, y);`
    },
    {
      description: 'should transpile division assignment',
      operation: 'x /= y',
      expectation: `"use strict";

x = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for("/")]) return _left[Symbol.for("/")](_right);else return _left / _right;
}(x, y);`
    },
    {
      description: 'should transpile remainder assignment',
      operation: 'x %= y',
      expectation: `"use strict";

x = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for("%")]) return _left[Symbol.for("%")](_right);else return _left % _right;
}(x, y);`
    },
    {
      description: 'should transpile exponentation assignment',
      operation: 'x **= y',
      expectation: `"use strict";

x = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for("**")]) return _left[Symbol.for("**")](_right);else return _left ** _right;
}(x, y);`
    },
    {
      description: 'should transpile left shift assignment',
      operation: 'x <<= y',
      expectation: `"use strict";

x = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for("<<")]) return _left[Symbol.for("<<")](_right);else return _left << _right;
}(x, y);`
    },
    {
      description: 'should transpile right shift assignment',
      operation: 'x >>= y',
      expectation: `"use strict";

x = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for(">>")]) return _left[Symbol.for(">>")](_right);else return _left >> _right;
}(x, y);`
    },
    {
      description: 'should transpile unsigned right shift assignment',
      operation: 'x >>>= y',
      expectation: `"use strict";

x = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for(">>>")]) return _left[Symbol.for(">>>")](_right);else return _left >>> _right;
}(x, y);`
    },
    {
      description: 'should transpile unsigned bitwise and assignment',
      operation: 'x &= y',
      expectation: `"use strict";

x = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for("&")]) return _left[Symbol.for("&")](_right);else return _left & _right;
}(x, y);`
    },
    {
      description: 'should transpile bitwise xor assignment',
      operation: 'x ^= y',
      expectation: `"use strict";

x = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for("^")]) return _left[Symbol.for("^")](_right);else return _left ^ _right;
}(x, y);`
    },
    {
      description: 'should transpile bitwise or assignment',
      operation: 'x |= y',
      expectation: `"use strict";

x = function (_left, _right) {
  'babel-operator-overload-plugin disabled';

  if (_left !== null && _left !== undefined && _left[Symbol.for("|")]) return _left[Symbol.for("|")](_right);else return _left | _right;
}(x, y);`
    },

  ]

  tests.map(({description, operation, expectation}) => {
    it(description, () => {
      const actual = babelCore.transform(
        operation,
        {
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' }}]
          ],
          plugins: [
            ['./src', {"enabled": true}]
          ]
        })
        console.log(actual.code)
        assert.equal(trim(actual.code), trim(expectation));
    })
  })
})
