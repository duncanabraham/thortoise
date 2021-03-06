const md5 = require('md5')
const { random } = require('../lib/utils')

/* Coords is a class that represents a point in 2D space. */
class Coords {
  constructor (x = 0, y = 0) {
    this.set(x, y)
  }

  set (x, y) {
    this.x = x
    this.y = y
  }

  toArray () {
    return [this.x, this.y]
  }

  equals (match) {
    return match.x === this.x && match.y === this.y
  }

  /**
   * How far is it from the current coord to the provided coord
   * @param {Coords} point
   */
  distanceTo (point) {
    return Math.sqrt(((point.x - this.x) * (point.x - this.x)) + ((point.y - this.y) * (point.y - this.y)))
  }

  /**
   * What is the bearing to the provided point
   * @param {Coords} point
   * @returns the bearing
   */
  bearingTo (point) {
    const bearing = (Math.atan2(point.y - this.y, point.x - this.x) * 180 / Math.PI) + 90
    return bearing < 0 ? bearing + 360 : bearing > 360 ? bearing - 360 : bearing
  }

  /**
   * Find the point half way to the provided point
   * @param {Coords} point
   * @returns {Coords} a point
   */
  midPoint (point) {
    return new Coords((this.x + point.x) / 2, (this.y + point.y) / 2)
  }

  /**
   * Given a point, return the slope of the line between this point and the given point.
   * @param point - The point to find the slope to.
   * @returns The slope of the line between the point and the current point.
   */
  slope (point) {
    return (point.y - this.y) / (point.x - this.x)
  }
}

/* It's a class that represents an item in a grid */
class GridItem {
  constructor (defaults) {
    this.id = md5((new Date().getTime()) + random(1000))
    Object.assign(this, defaults)
  }

  /**
   * It takes two numbers, x and y, and sets the position property of the object to a new Coords object
   * with those numbers as its x and y properties.
   * @param x - The x position of the object.
   * @param y - The y position of the object.
   */
  addPosition (x, y) {
    this.position = new Coords(x, y)
  }

  /**
   * It takes an object and compares it to the current object, returning an object with the keys that
   * matched and the number of matches
   * @param item - The item to match against.
   * @returns An object with the keys of the item that match the keys of the object and the value of
   * 'matched'
   */
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

  clone () {
    const newItem = new GridItem(this)
    newItem.id = this.id
    return newItem
  }
}

/* > A grid is a 2D array of items that can be added, removed and queried */
class Grid {
  constructor (options) {
    Object.assign(this, options)
    this.grid = new Array(this.width * this.length)
  }

  _position (coords) {
    return coords.x * this.width + coords.y
  }

  _xy (position) {
    const x = Math.floor(position / this.width)
    const y = position % this.width
    return new Coords(x, y)
  }

  /**
   * Return a grid as a binary maze which can be solved
   */
  asBinaryGrid () {
    const gridValues = new Array(this.width * this.length).fill(0)
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i] && this.grid[i].fixed) {
        gridValues[i] = 1
      }
    }
    const maze = []
    for (let j = 0; j < this.length; j++) {
      maze.push(gridValues.splice(0, this.width))
    }
    return maze
  }

  /**
   * Store a value at a position overwriting any previous value
   * @param {coords} coords where to store the item
   * @param {GridItem} value the values to store
   */
  add (coords, value) {
    value.position = coords
    this.grid[this._position(coords)] = value
  }

  /**
   * Remove values stored at a specified location
   * @param {coords} coords where to remove the item
   */
  clear (coords) {
    this.grid[this._position(coords)] = undefined
  }

  /**
   * Return the value at a given x,y position
   * @param {Coords} coords
   * @returns {Griditem}
   */
  valueAt (coords) {
    return this.grid[this._position(coords)]
  }

  /**
   * Determine if an item exists in the grid
   * @param {*} item
   * @returns the found item
   */
  hasFeature (item) {
    return this.grid.find((i, index) => {
      if (i && i.equals(item)) {
        i.position = this._xy(index)
        return i
      } else {
        return null
      }
    })
  }

  export () {
    return JSON.stringify(this.grid)
  }
}

module.exports = {
  Grid,
  GridItem,
  coords: (x, y) => new Coords(x, y),
  Coords
}
