const Coords = require('./2dcoord')
const { v4: uuid } = require('uuid')

/* It's a class that represents an item in a grid */
class GridItem {
  constructor (defaults) {
    this.id = uuid()
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

module.exports = GridItem
