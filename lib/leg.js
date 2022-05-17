const Servo = require('./servo')

const defaultServoPositions = [
  { name: 'hip', steps: 0.02 },
  { name: 'femur', steps: 0.02 },
  { name: 'knee', steps: 0.02 }
]

class Leg {
  /**
   * Leg accepts an array of servo Objects
   * @param {*} options {id, driver}
   */
  constructor(options) {
    Object.assign(this, options)
    this.baseId = this.id * 3
    this.hip = new Servo({ id: this.baseId, name: `hip${this.baseId}` }, this.driver)
    this.femur = new Servo({ id: this.baseId + 1, name: `femur${this.baseId}` }, this.driver)
    this.knee = new Servo({ id: this.baseId + 2, name: `knee${this.baseId}` }, this.driver)
    this._init()
  }

  _init() {
    defaultServoPositions.forEach(servoDefaults => {
      this[servoDefaults.name].setSteps(servoDefaults.steps)
    })
  }

  /**
   * Set the leg joints to specific angles
   * @param {triplet} t {hip, femmur, knee} values for each angle
   */
  setAngles(t) {
    this.position = t
    this._setJoints()
  }

  /**
   * Set the leg joints to set angles
   * @param {triplet} t {hip, femur, knee} values in steps: 0, 1 or 2
   */
  setPosition(t) {
    this.position = t
    this._moveJoints()
  }

  _moveJoints() {
    this.hip.setPosition(this.position.hip)
    this.femur.setPosition(this.position.femur)
    this.knee.setPosition(this.position.knee)
  }

  _setJoints() {
    this.hip.setAbsolutePosition(this.position.hip)
    this.femur.setAbsolutePosition(this.position.femur)
    this.knee.setAbsolutePosition(this.position.knee)
  }
}

module.exports = Leg
