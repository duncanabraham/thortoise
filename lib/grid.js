const md5 = require('md5')
const { random } = require('../lib/utils')
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
    this.id = md5((new Date().getTime())+random(1000))
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

  /**
   * Does this item match the supplied item
   * @param {*} GridItem 
   * @returns {boolean}
   */
  equals (item) {
    let matched = true
    Object.keys(item).forEach(key => {
      if (!this[key] || this[key] !== item[key]) matched = false
    })
    return matched
  }

  /**
   * Do some fields match the supplied values
   * @param {GridItem} item 
   * @returns {boolean}
   */
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

  /**
   * Store a value at a position overwriting any previous value
   * @param {coords} coords where to store the item
   * @param {Object} value the values to store 
   */
  add (coords, value) {
    this.grid[this._position(coords)] = value
  }

  /**
   * Remove values stored at a specified location
   * @param {coords} coords where to remove the item 
   */
  clear (coords) {
    this.grid[this._position(coords)] = undefined
  }

  valueAt (coords) {
    return this.grid[this._position(coords)]
  }

  hasFeature (item) {
    return !!this.grid.find(i => i && i.equals(item))
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
