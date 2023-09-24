class GeoPoint {
  contructor (lat, lon) {
    this.update({ lat, lon })
  }

  // Take GPS data and absorb into this object
  update (data) {
    Object.assign(this, data)
  }
}

module.exports = GeoPoint
