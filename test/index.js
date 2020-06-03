var babel = require("@babel/core");

result = babel.transformFileSync(
  './examples/src/index.js',
  {
    presets: ['@babel/preset-env'],
    plugins: [
      ['./src', {"enabled": true}]
    ]
  })
console.log(result.code)