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

x = (() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("+")] ? x[Symbol.for("+")](y) : x + y;
})();`
    },
    {
      description: 'should transpile subtraction assignment',
      operation: 'x -= y',
      expectation: `"use strict";

x = (() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("-")] ? x[Symbol.for("-")](y) : x - y;
})();`
    },
    {
      description: 'should transpile multiplication assignment',
      operation: 'x *= y',
      expectation: `"use strict";

x = (() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("*")] ? x[Symbol.for("*")](y) : x * y;
})();`
    },
    {
      description: 'should transpile division assignment',
      operation: 'x /= y',
      expectation: `"use strict";

x = (() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("/")] ? x[Symbol.for("/")](y) : x / y;
})();`
    },
    {
      description: 'should transpile remainder assignment',
      operation: 'x %= y',
      expectation: `"use strict";

x = (() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("%")] ? x[Symbol.for("%")](y) : x % y;
})();`
    },
    {
      description: 'should transpile exponentation assignment',
      operation: 'x **= y',
      expectation: `"use strict";

x = (() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("**")] ? x[Symbol.for("**")](y) : x ** y;
})();`
    },
    {
      description: 'should transpile left shift assignment',
      operation: 'x <<= y',
      expectation: `"use strict";

x = (() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("<<")] ? x[Symbol.for("<<")](y) : x << y;
})();`
    },
    {
      description: 'should transpile right shift assignment',
      operation: 'x >>= y',
      expectation: `"use strict";

x = (() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for(">>")] ? x[Symbol.for(">>")](y) : x >> y;
})();`
    },
    {
      description: 'should transpile unsigned right shift assignment',
      operation: 'x >>>= y',
      expectation: `"use strict";

x = (() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for(">>>")] ? x[Symbol.for(">>>")](y) : x >>> y;
})();`
    },
    {
      description: 'should transpile unsigned bitwise and assignment',
      operation: 'x &= y',
      expectation: `"use strict";

x = (() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("&")] ? x[Symbol.for("&")](y) : x & y;
})();`
    },
    {
      description: 'should transpile bitwise xor assignment',
      operation: 'x ^= y',
      expectation: `"use strict";

x = (() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("^")] ? x[Symbol.for("^")](y) : x ^ y;
})();`
    },
    {
      description: 'should transpile bitwise or assignment',
      operation: 'x |= y',
      expectation: `"use strict";

x = (() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("|")] ? x[Symbol.for("|")](y) : x | y;
})();`
    },
    {
      description: 'should transpile equal to comparison',
      operation: 'x == y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("==")] ? x[Symbol.for("==")](y) : x == y;
})();`
    },
    {
      description: 'should transpile not equal to comparison',
      operation: 'x != y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("!=")] ? x[Symbol.for("!=")](y) : x != y;
})();`
    },
    {
      description: 'should transpile less than comparison',
      operation: 'x < y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("<")] ? x[Symbol.for("<")](y) : x < y;
})();`
    },
    {
      description: 'should transpile less than or equal to comparison',
      operation: 'x <= y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("<=")] ? x[Symbol.for("<=")](y) : x <= y;
})();`
    },
    {
      description: 'should transpile greater than comparison',
      operation: 'x > y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for(">")] ? x[Symbol.for(">")](y) : x > y;
})();`
    },
    {
      description: 'should transpile greater than or equal to comparison',
      operation: 'x >= y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for(">=")] ? x[Symbol.for(">=")](y) : x >= y;
})();`
    },
    {
      description: 'should not transpile equal and same type comparison',
      operation: 'x === y',
      expectation: `"use strict";

x === y;`
    },
    {
      description: 'should not transpile not same type and equal type comparison',
      operation: 'x === y',
      expectation: `"use strict";

x === y;`
    },
    {
      description: 'should transpile addition',
      operation: 'x + y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("+")] ? x[Symbol.for("+")](y) : x + y;
})();`
    },
    {
      description: 'should transpile subtraction',
      operation: 'x - y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("-")] ? x[Symbol.for("-")](y) : x - y;
})();`
    },
    {
      description: 'should transpile multiplication',
      operation: 'x * y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("*")] ? x[Symbol.for("*")](y) : x * y;
})();`
    },
    {
      description: 'should transpile division',
      operation: 'x / y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("/")] ? x[Symbol.for("/")](y) : x / y;
})();`
    },
    {
      description: 'should transpile remainder',
      operation: 'x % y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("%")] ? x[Symbol.for("%")](y) : x % y;
})();`
    },
    {
      description: 'should transpile exponent',
      operation: 'x ** y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("**")] ? x[Symbol.for("**")](y) : x ** y;
})();`
    },
    {
      description: 'should pre-increment',
      operation: '++x',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && typeof x === 'object' && x[Symbol.for("prefix-increment")] ? x[Symbol.for("prefix-increment")]() : ++x;
})();`
    },
    {
      description: 'should pre-decrement',
      operation: '--x',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && typeof x === 'object' && x[Symbol.for("prefix-decrement")] ? x[Symbol.for("prefix-decrement")]() : --x;
})();`
    },
    {
      description: 'should post-increment',
      operation: 'x++',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && typeof x === 'object' && x[Symbol.for("postfix-increment")] ? x[Symbol.for("postfix-increment")]() : x++;
})();`
    },
    {
      description: 'should post-decrement',
      operation: 'x--',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && typeof x === 'object' && x[Symbol.for("postfix-decrement")] ? x[Symbol.for("postfix-decrement")]() : x--;
})();`
    },
    {
      description: 'should transpile bitwise and',
      operation: 'x & y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("&")] ? x[Symbol.for("&")](y) : x & y;
})();`
    },
    {
      description: 'should transpile bitwise or',
      operation: 'x | y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("|")] ? x[Symbol.for("|")](y) : x | y;
})();`
    },
    {
      description: 'should transpile bitwise xor',
      operation: 'x ^ y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("^")] ? x[Symbol.for("^")](y) : x ^ y;
})();`
    },
    {
      description: 'should transpile bitwise not',
      operation: '~x',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("function Symbol() { [native code] }")] ? x[Symbol.for("~")]() : ~x;
})();`
    },
    {
      description: 'should transpile let shift',
      operation: 'x << y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for("<<")] ? x[Symbol.for("<<")](y) : x << y;
})();`
    },
    {
      description: 'should transpile sign propagating right shift',
      operation: 'x >> y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for(">>")] ? x[Symbol.for(">>")](y) : x >> y;
})();`
    },
    {
      description: 'should transpile zero fill right shift',
      operation: 'x >>> y',
      expectation: `"use strict";

(() => {
  'babel-operator-overload-plugin disabled';

  return x !== undefined && x !== null && x[Symbol.for(">>>")] ? x[Symbol.for(">>>")](y) : x >>> y;
})();`
    },
    {
      description: 'should transpile logical and',
      operation: 'x && y',
      expectation: `"use strict";

x && y;`
    },
    {
      description: 'should transpile logical or',
      operation: 'x || y',
      expectation: `"use strict";

x || y;`
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
