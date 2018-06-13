# babel-operator-overload-plugin

A Babel plugin for operator overloading.

## Example

The code:
```javascript
class Point {

    constructor(x, y) {
        this.x = x
        this.y = y
    }
    
    __add__(other) {
        const x = this.x + other.x
        const y = this.y + other.y
        return new Point(x, y)
    }
}

const p1 = new Point(5, 5)
const p2 = new Point(2, 3)
const p3 = p1 + p2
console.log(p3)
```
produces the following output:
```bash
Point { x: 7, y: 8 }
```

## Status

This is the first babel plugin I have written, so your mileage may vary.

I would appreciate any help!

## Usage

1. Make a new folder and create a package.json file:
```bash
~$ mkdir my-app
~$ cd my-app
~/my-app$ npm init -y
```
2. Install babel and the basic preset (also `babel-cli` for easier testing):
```bash
~/my-app$ npm install --save-dev babel-core babel-preset-env babel-cli
```
3. Install the operator overload plugin:
```bash
~/my-app$ npm install --save-dev https://github.com/rob-blackbourn/babel-operator-overload-plugin.git
```
4. Create a `.babelrc` file:
```bash
~/my-app$ cat > .babelrc
{
    "presets": [
        "env"
    ],
    "plugins": ["babel-operator-overload-plugin"]
}
^D
```
5. Write some code:
```bash
~/my-app$ cat > index.js
class Point {

    constructor(x, y) {
        this.x = x
        this.y = y
    }
    
    __add__(other) {
        const x = this.x + other.x
        const y = this.y + other.y
        return new Point(x, y)
    }
}

const p1 = new Point(5, 5)
const p2 = new Point(2, 3)
const p3 = p1 + p2
console.log(p3)
^D
```
6. Run it with `babel-node`:
```bash
~/my-app$ ./node_modules/.bin/babel-node.cmd index.js
Point { x: 7, y: 8 }
```

## Description

The plugin uses the [operator-overload-polyfills](https://github.com/rob-blackbourn/operator-overload-polyfills) package to redirect operators to functions on the root object.

For example the polyfill for addition is:
```javascript
if (!Object.prototype.__add__) {
  Object.prototype.__add__ = function (other) {
    return this + other
  }
}
```

The Babel plugin re-writes operators to use these polyfills.

For example the following code:
```javascript
let a = 1, b = 2
let c = a + b
```
gets re-written as:
```javascript
let a = 1, b = 2
let c = a.__add__(b)
```

This allows the creation of custom overrides such as:
```javascript
class Point {

    constructor(x, y) {
        this.x = x
        this.y = y
    }
    
    __add__(other) {
        const x = this.x + other.x
        const y = this.y + other.y
        return new Point(x, y)
    }
}
```

## Options

Operator overloading is enabled for all files by default. This means all operator calls will have an indirection step before the actual operation is invoked.

This can be disabled globally in the `.babelrc`:
```json
    {
        "presets": [
            "env"
        ],
        "plugins": [
            ["babel-operator-overload-plugin", { "enabled": false }]
        ]
    }
```
and enabled selectively by including `'babel-operator-overload-plugin enabled'` at the start of a file or within a block:
```javascript
'babel-operator-overload-plugin enabled'

class Point {

    constructor(x, y) {
        this.x = x
        this.y = y
    }
    
    __add__(other) {
        const x = this.x + other.x
        const y = this.y + other.y
        return new Point(x, y)
    }
}
```

## Supported operations

The following operators are supported

### Binary operators

Operator|Function
--------|--------
`+`     | `__add__(other)`
`-`     | `__sub__(other)`
`*`     | `__mul__(other)`
`/`     | `__div__(other)`
`%`     | `__mod__(other)`
`**`    | `__pow__(other)`
`&`     | `__and__(other)`
`|`     | `__or__(other)`
`^`     | `__xor__(other)`
`<<`    | `__lshift__(other)`
`>>`    | `__rshift__(other, propogateRight=true)`
`>>>`   | `__rshift__(other, propogateRight=false)`
`<`     | `__lt__(other)`
`<=`    | `__le__(other)`
`>`     | `__gt__(other)`
`>=`    | `__ge__(other)`
`==`    | `__eq__(other)`
`!=`    | `__ne__(other)`

### Unary operators

Operator|Function
--------|--------
`+`     | `__plus__`
`-`     | `__neg__`
`++`    | `__incr__(prefix)`
`--`    | `__decr__(prefix)`
`~`     | `__not__`