// const Servo = require('./servo')
const { Triplet } = require('./triplet')
class Leg {
  /**
   * A leg has 3 servos which can be different types
   * @param {*} options {id, driver, servo: settings specific to this type of servo}
   */
  constructor(options) {
    Object.assign(this, options)
    this.baseId = this.id * 3
    this._init()
    this.servos = {}
  }

  _createLegs() {
    const { makeServo } = this.driver
    this.servos.hip = makeServo({ id: this.baseId, name: `hip${this.baseId}`, ...this.hipServoSettings })
    this.servos.femur = makeServo({ id: this.baseId + 1, name: `femur${this.baseId}`, ...this.femurServoSettings })
    this.servos.knee = makeServo({ id: this.baseId + 2, name: `knee${this.baseId}`, ...this.kneeServoSettings })
  }

  _init() {
    this._createLegs()
  }

  /**
   * Stop all the servos - KILL
   */
  stop() {
    Object.keys(this.servos).forEach(key => {
      this.servos[key].stop()
    })
  }

  /**
   * Return all the servos to their start position
   */
  home() {
    Object.keys(this.servos).forEach(key => {
      this.servos[key].to(this[`${key}ServoSettings`].startAt)
    })
  }

  get position() {
    return this.position
  }

  /**
   * Set the leg joints to specific angles
   * @param {Triplet} pos {hip, femur, knee} values for each angle
   * @param {number} ms The number of milliseconds to take to perform the move
   */
  setAngles(pos, ms = 1000) {
    console.log('set angles: ', pos)
    this.position = pos
    this.servos.hip.to(pos.t1, ms)
    this.servos.femur.to(pos.t2, ms)
    this.servos.knee.to(pos.t3, ms)
  }
}

module.exports = Leg
