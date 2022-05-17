class Coords {
  constructor(x = 0, y = 0) {
    this.set(x, y)
  }

  set(x, y) {
    this.x = x
    this.y = y
  }
}

class GridItem {
  constructor(defaults) {
    Object.assign(this, defaults)
  }

  matches(item) {
    let matched = true
    Object.keys(item).forEach(key => {
      if (!this[key] || this[key] !== item[key]) matched = false
    })
    return matched
  }

  like(item) {
    let matched = false
    Object.keys(item).forEach(key => {
      if (this[key] || this[key] === item[key]) matched = true
    })
    return matched
  }
}

class Grid {
  constructor(w, l) {
    this.width = w
    this.length = l
    this.grid = new Array(w * l)
  }

  _position(coords) {
    return coords.x * this.width + coords.y
  }

  add(coords, value) {
    this.grid[this._position(coords)] = value
  }

  clear(coords) {
    this.grid[this._position(coords)] = undefined
  }

  valueAt(coords) {
    return this.grid[this._position(coords)]
  }

  hasFeature(item) {
    return this.grid.find(i => i.matches(item))
  }

  hasFeatureLike(item) {
    return this.grid.find(i => i.like(item))
  }
}

module.exports = {
  Grid,
  GridItem,
  coords: (x, y) => new Coords(x, y)
}