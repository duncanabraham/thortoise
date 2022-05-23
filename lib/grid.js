class Coords {
  constructor (x = 0, y = 0) {
    this.set(x, y)
  }

  set (x, y) {
    this.x = x
    this.y = y
  }
}

class GridItem {
  constructor (defaults) {
    Object.assign(this, defaults)
  }

  match (item) {
    const result = {}
    Object.keys(item).forEach(i => {
      if (this[i] && this[i] === item[i]) {
        result[i] = 'matched'
      }
    })
    return { ...result, count: Object.keys(result).length }
  }

  sortItemsByMatches (items, desc = false) {
    const result = []
    items.forEach(i => result.push(this.match(i)))
    return result.sort((a, b) => {
      if (desc) {
        return a.count - b.count
      } else {
        return b.count - a.count
      }
    })
  }

  equals (item) {
    let matched = true
    Object.keys(item).forEach(key => {
      if (!this[key] || this[key] !== item[key]) matched = false
    })
    return matched
  }

  like (item) {
    let matched = false
    Object.keys(item).forEach(key => {
      if (this[key] || this[key] === item[key]) matched = true
    })
    return matched
  }
}

class Grid {
  constructor (w, l) {
    this.width = w
    this.length = l
    this.grid = new Array(w * l)
  }

  _position (coords) {
    return coords.x * this.width + coords.y
  }

  add (coords, value) {
    this.grid[this._position(coords)] = value
  }

  clear (coords) {
    this.grid[this._position(coords)] = undefined
  }

  valueAt (coords) {
    return this.grid[this._position(coords)]
  }

  hasFeature (item) {
    return this.grid.find(i => i.equals(item))
  }

  hasFeatureLike (item) {
    return this.grid.filter(i => i.like(item))
  }

  export () {
    return JSON.stringify(this.grid)
  }
}

module.exports = {
  Grid,
  GridItem,
  coords: (x, y) => new Coords(x, y)
}
