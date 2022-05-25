const { Triplet } = require('./triplet')
const { calculateXyz } = require('./kinematics')
class Pos extends Triplet {
  /**
   * Add the angles to the leg, and also the distance of the foot from the hip
   * @param {*} t1 the angle of rotation at the hip
   * @param {*} t2 the angle of elevation at the femur
   * @param {*} t3 the angle of elevation at the knee
   */
  constructor (t1, t2, t3, name, startPos, femurLength, tibiaLength) {
    super(t1, t2, t3)
    this.name = name
    this.startPos = startPos
    this.distanceFromHipToFoot = 0
    this.angleAtFemur = 0
    this.angleAtKnee = 0
    this.angleAtHip = 0
    this.femurLength = femurLength
    this.tibiaLength = tibiaLength
    this._calcPosition()
  }

  /**
   * Take a triplet or child thereof and set our t1, t2 and t3 from the values therein
   * @param {Triplet} position a set of angles in degrees
   */
  setAngles (position) {
    const { t1, t2, t3 } = position
    this.t1 = t1 > 360 ? t1 - 360 : t1 < 0 ? 360 + t1 : t1
    this.t2 = t2 > 360 ? t2 - 360 : t2 < 0 ? 360 + t2 : t2
    this.t3 = t3 > 360 ? t3 - 360 : t3 < 0 ? 360 + t3 : t3
  }

  addAngles (position) {
    const { t1, t2, t3 } = position
    this.t1 += t1
    this.t2 += t2
    this.t3 += t3
  }

  clone () {
    return new Pos(this.t1, this.t2, this.t3, this.name, this.startPos, this.femurLength, this.tibiaLength)
  }

  getAngles () {
    return new Triplet(this.t1, this.t2, this.t3)
  }

  _calcPosition () {
    const pos = calculateXyz(this)
    const { t1: x, t2: y, t3: z } = pos
    this.position = pos
    // As a reminder:
    // y is the vertical distance between the hip and the foot
    // x is the horizontal distance of the foot from the hip
    // z is the deviation of the hip from forward, ie is it angled left or right of center
    this.groundClearance = z
    this.footX = x
    this.footY = y
  }
}

class QuadPos {
  constructor (l1, l2, l3, l4) {
    Object.assign(this, { l1, l2, l3, l4 })
  }

  fromArray (arr) {
    this.l1 = arr[0]
    this.l2 = arr[1]
    this.l3 = arr[2]
    this.l4 = arr[3]
  }
}

module.exports = {
  Pos,
  QuadPos
}
