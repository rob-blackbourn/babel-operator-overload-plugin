var babel = require("@babel/core");

result = babel.transformFileSync('./examples/src/point.js', { presets: ['@babel/preset-env'], plugins: [['./src', {"enabled": true}]]})
console.log(result.code)