const { Triplet } = require('./triplet')
const { calculateXyz } = require('./kinematics')
class Pos extends Triplet {
  /**
   * Add the angles to the leg, and also the distance of the foot from the hip
   * @param {*} x the angle of rotation at the hip
   * @param {*} y the angle of elevation at the femur
   * @param {*} z the angle of elevation at the knee
   */
  constructor (x, y, z, name, startPos, femurLength, tibiaLength) {
    super(x, y, z)
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
   * Take a triplet or child thereof and set our x, y and z from the values therein
   * @param {Triplet} position a set of angles in degrees
   */
  setAngles (position) {
    const { x, y, z } = position
    this.x = x
    this.y = y
    this.z = z
  }

  /**
   * It adds the angles of the position object to the angles of the robot
   * @param position
   */
  addAngles (position) {
    const { x, y, z } = position
    this.x += x
    this.y += y
    this.z += z
  }

  /**
   * It creates a new object with the same properties as the original object.
   * @returns A new instance of the Pos class.
   */
  clone () {
    return new Pos(this.x, this.y, this.z, this.name, this.startPos, this.femurLength, this.tibiaLength)
  }

  /**
   * It returns a new Triplet object with the same angles as the original.
   * @returns A new Triplet object with the values of the current Triplet object.
   */
  getAngles () {
    return new Triplet(this.x, this.y, this.z)
  }

  /**
   * It calculates the position of the hip from the foot
   */
  _calcPosition () {
    const pos = calculateXyz(this)
    const { x, y, z } = pos
    this.position = pos
    // for reference:
    // - x is distance forward from directly under the hip
    // - y is the deviation left or right when looking down
    // - z is the height of the hip from the foot, which may not be on the floor
    this.groundClearance = z
    this.footX = x
    this.footY = y
  }
}

module.exports = { Pos }
