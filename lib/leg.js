const { Triplet } = require('./triplet')
class Leg {
  /**
   * A leg has 3 servos which can be different types
   * @param {*} options {id, driver, servo: settings specific to this type of servo}
   */
  constructor (options) {
    Object.assign(this, options)
    this.servos = {}
    this.baseId = this.id * 3
    this._init()
  }

  _createLegs () {
    const { makeServo } = this.driver
    this.servos.hip = makeServo({ pin: this.baseId, name: `hip${this.baseId}`, ...this.hipServoSettings })
    this.servos.femur = makeServo({ pin: this.baseId + 1, name: `femur${this.baseId}`, ...this.femurServoSettings })
    this.servos.knee = makeServo({ pin: this.baseId + 2, name: `knee${this.baseId}`, ...this.kneeServoSettings })
  }

  _init () {
    this._createLegs()
  }

  /**
   * Stop all the servos - KILL
   */
  stop () {
    Object.keys(this.servos).forEach(key => {
      this.servos[key].stop()
    })
  }

  /**
   * Return all the servos to their start position
   */
  home () {
    const homePosition = new Triplet(this.servos.hip.startAt, this.servos.femur.startAt, this.servos.knee.startAt)
    this.setAngles(homePosition)
  }

  get position () {
    return this._position
  }

  set position (p) {
    this._position = p
  }

  /**
   * Set the leg joints to specific angles
   * @param {Pos} pos hip, femur, knee and limb lengths
   * @param {number} ms The number of milliseconds to take to perform the move
   */
  setAngles (pos, ms = 1000) {
    console.log('this.servos: ', this.servos)
    console.log('position: ', pos)
    this.position = pos
    this.servos.hip.to(pos.t1, ms)
    this.servos.femur.to(pos.t2, ms)
    this.servos.knee.to(pos.t3, ms)
  }
}

module.exports = Leg
