const { coords } = require('./grid')

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

module.exports = Coords
