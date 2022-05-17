class Coords {
  constructor(x = 0, y = 0) {
    this.set(x, y)
  }

  set(x, y) {
    this.x = x
    this.y = y
  }

  get value() {
    return { x: this.x, y: this.y }
  }
}

class GridItem {
  constructor(defaults) {
    Object.assign(this, defaults)
  }
}

class Grid {
  constructor(w, l) {
    this.width = w
    this.length = l
    this.grid = new Array(w * l)
  }

  add(coords, value) {
    this.grid[coords.x * this.width + coords.y] = value
  }

  valueAt(coords) {
    return this.grid[coords.x * this.width + coords.y]
  }
}

module.exports = {
  Grid,
  GridItem,
  coords: (x, y) => new Coords(x, y)
}