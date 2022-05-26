class Triplet {
  constructor (t1, t2, t3) {
    Object.assign(this, { t1, t2, t3 })
  }

  equals (t) {
    return t.t1 === this.t1 && t.t2 === this.t2 && t.t3 === this.t3
  }

  toRadians () {
    const t1 = this.toRad(this.t1)
    const t2 = this.toRad(this.t2)
    const t3 = this.toRad(this.t3)
    return new Triplet(t1, t2, t3)
  }

  toDegrees () {
    const t1 = this.toDeg(this.t1)
    const t2 = this.toDeg(this.t2)
    const t3 = this.toDeg(this.t3)
    return new Triplet(t1, t2, t3)
  }

  rounded () {
    return new Triplet(Math.round(this.t1), Math.round(this.t2), Math.round(this.t3))
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
    return [this.t1, this.t2, this.t3]
  }

  constrain () {
    this.t1 = this.t1 < 0 ? this.t1 + 360 : this.t1 > 360 ? this.t1 - 360 : this.t1
    this.t2 = this.t2 < 0 ? this.t2 + 360 : this.t2 > 360 ? this.t2 - 360 : this.t2
    this.t3 = this.t3 < 0 ? this.t3 + 360 : this.t3 > 360 ? this.t3 - 360 : this.t3
  }
}

class QuadTrip {
  constructor (q1, q2, q3, q4) {
    Object.assign(this, { q1, q2, q3, q4 })
  }
}

module.exports = {
  Triplet,
  QuadTrip
}
