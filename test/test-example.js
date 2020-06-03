var babel = require("@babel/core");

var result = babel.transformFileSync(
  './examples/src/index.js',
  {
    presets: ['@babel/preset-env'],
    plugins: [
      ['./src', {"enabled": true}]
    ]
  })
console.log(result.code)

