class Triplet {
  constructor(hip, femur, knee) {
    Object.assign(this, { hip, femur, knee })
  }

  isTriplet(t) {
    return t instanceof Triplet
  }

  equals(t) {
    return t.hip === this.hip && t.femur === this.femur && t.knee === this.knee
  }
}

module.exports = Triplet
