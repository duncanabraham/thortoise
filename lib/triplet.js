class Triplet {
  /**
   * Store 3 numbers in a convenient way
   * @param {*} x the first number
   * @param {*} y the second number
   * @param {*} z the third number
   */
  constructor (x, y, z) {
    Object.assign(this, { x, y, z })
  }

  equals (t) {
    return t.x === this.x && t.y === this.y && t.z === this.z
  }

  clone () {
    return new Triplet(this.x, this.y, this.z)
  }

  toRadians () {
    const x = this.toRad(this.x)
    const y = this.toRad(this.y)
    const z = this.toRad(this.z)
    return new Triplet(x, y, z)
  }

  toDegrees () {
    const x = this.toDeg(this.x)
    const y = this.toDeg(this.y)
    const z = this.toDeg(this.z)
    return new Triplet(x, y, z)
  }

  rounded () {
    return new Triplet(Math.round(this.x), Math.round(this.y), Math.round(this.z))
  }

  // Helper function to convert degrees to radians
  toRad (d) {
    return (Math.PI / 180) * d
  }

  // Helper function to convert radians to degrees
  toDeg (r) {
    return r * (180 / Math.PI)
  }

  square (n) {
    return n * n
  }

  value () {
    return [this.x, this.y, this.z]
  }

  export () {
    return this.value().join(',')
  }

  /**
   * Update the values stored in this Triplet
   * @param {*}.x the first value
   * @param {*}.y the second value
   * @param {*}.z the third value
   */
  import (x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  /**
   * Set the lowest values
   * @param {Triplet} t
   */
  minValues (t) {
    this.x = Math.min(this.x, t.x)
    this.y = Math.min(this.y, t.y)
    this.z = Math.min(this.z, t.z)
  }

  /**
   * Set the highest values
   * @param {Triplet} t
   */
  maxValues (t) {
    this.x = Math.max(this.x, t.x)
    this.y = Math.max(this.y, t.y)
    this.z = Math.max(this.z, t.z)
  }

  invert (n) {
    const v = n - 180
    return v < 0 ? v + 360 : v > 360 ? v - 360 : v
  }

  /**
   * shift all the angles by 180 degrees
   */
  inverse () {
    this.x = this.invert(this.x)
    this.y = this.invert(this.y)
    this.z = this.invert(this.z)
    return this
  }
}

module.exports = { Triplet }
