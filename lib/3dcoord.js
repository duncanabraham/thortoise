class Point {
  constructor (x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    this.content = {}
  }

  setContent (content) {
    this.content = { ...this.content, ...content }
  }

  clearContent () {
    this.content = {}
  }

  set (x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  toArray () {
    return [this.x, this.y, this.z]
  }

  equals (point) {
    return point.x === this.x && point.y === this.y && point.z === this.z
  }

  distanceTo (point) {
    return Math.sqrt(
      Math.pow((point.x - this.x), 2) +
      Math.pow((point.y - this.y), 2) +
      Math.pow((point.z - this.z), 2)
    )
  }

  pointToKey () {
    return `${this.x},${this.y},${this.z}`
  }

  bearingTo (point) {
    const dx = point.x - this.x
    const dy = point.y - this.y
    const dz = point.z - this.z
    const distance = this.distanceTo(point)

    // Calculate azimuth in degrees
    const azimuth = Math.atan2(dy, dx) * (180 / Math.PI)

    // Calculate elevation in degrees
    const elevation = Math.asin(dz / distance) * (180 / Math.PI)

    return { azimuth, elevation }
  }

  midPoint (point) {
    return new Point(
      (this.x + point.x) / 2,
      (this.y + point.y) / 2,
      (this.z + point.z) / 2
    )
  }
}

module.exports = {
  Point,
  point: (x, y, z) => new Point(x, y, z)
}
