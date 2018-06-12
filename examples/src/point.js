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

    toString() {
      return `x=${this.x}, y=${this.y}`
    }
  }