'babel-operator-overload-plugin enabled'

export default class Point {
  
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  __add__(other) {
    const x = this.x + other.x
    const y = this.y + other.y
    return new Point(x, y)
  }

  __eq__(other) {
    return this.x == other.x && this.y == other.y
  }

  toString() {
    return `x=${this.x}, y=${this.y}`
  }
}