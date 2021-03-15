# babel-operator-overload-plugin

**Edit**: There is a more recent version of this project in [jetblack-operator-overloading](https://github.com/rob-blackbourn/jetblack-operator-overloading).

A Babel plugin for operator overloading.

There is a trivial template project [here](https://github.com/rob-blackbourn/babel-operator-overload-plugin-example).

This was based on an [idea](https://github.com/foxbenjaminfox/babel-operator-overload-plugin)
by [Benjamin Fox](https://github.com/foxbenjaminfox)

## Example

The following code adds two integers and then two points.

The directive at the start is required to enable the transformation.

```javascript
'babel-operator-overload-plugin enabled'

class Point {

    constructor(x, y) {
        this.x = x
        this.y = y
    }
    
    [Symbol.for('+')](other) {
        const x = this.x + other.x
        const y = this.y + other.y
        return new Point(x, y)
    }
}

const x1 = 2
const x2 = 3
const x3 = x1 + x2
console.log(x3)

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

28-May-2020: Updated to babel 7.
03-JUN-2020: Refactored to use a function wrapper to handle nulls. Moved to `Symbol.for`. Removed the requirement for shims.

## Usage

1. Make a new folder and create a package.json file:
```bash
~$ mkdir my-app
~$ cd my-app
~/my-app$ npm init -y
```
2. Install babel and the basic preset (also `babel-cli` for easier testing):
```bash
~/my-app$ npm install --save-dev @babel/core @babel/preset-env @babel/cli
```
3. Install the operator overload plugin:
```bash
~/my-app$ npm install --save-dev https://github.com/rob-blackbourn/babel-operator-overload-plugin.git#3.0.0
```
4. Create a `.babelrc` file:
```bash
~/my-app$ cat > .babelrc
{
    "presets": [
        "@babel/preset-env"
    ],
    "plugins": ["module:babel-operator-overload-plugin"]
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
    
    [Symbol.for('+')](other) {
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

The plugin wraps expressions in function calls. 

```javascript
function(left, right) {
    if (left !== undefined && left !== null && left[Symbol.for('+')]) {
        return left[Symbol.for('+')](right)
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
let c = function(left,right) { if (left !== undefine && left !== null && left[Symbol.for('+')) { left[Symbol.for('+')](right)} else { left + right })(a, b)
```

This allows the creation of custom overrides such as:
```javascript
class Point {

    constructor(x, y) {
        this.x = x
        this.y = y
    }
    
    [Symbol.For('+')](other) {
        const x = this.x + other.x
        const y = this.y + other.y
        return new Point(x, y)
    }
}
```

### Assigment operators

Assignment operators re-write the code into an operation and an assignment.

For example the following code:
```javascript
let a = 1
a += 3
```
gets re-written as:
```javascript
let a = 1
a = function(left,right) { if (left !== undefine && left !== null && left[Symbol.for('+')) { left[Symbol.for('+')](right)} else { left + right })(a, 3)
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
    
    [Symbol.for('+')](other) {
        const x = this.x + other.x
        const y = this.y + other.y
        return new Point(x, y)
    }
}
```

## Supported operations

Binary and unary operators are supported.
