var babel = require("babel-core");

result = babel.transformFileSync('./examples/src/point.js', { presets: ['env'], plugins: ['../../src']})
console.log(result.code)