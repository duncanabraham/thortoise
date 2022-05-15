
const defaultServoPositions = [
  { name: 'hip', steps: 0.05 },
  { name: 'femur', steps: 0.05 },
  { name: 'knee', steps: 0.05 }
]

class Leg {
  /**
   * Leg accepts an array or servo Objects
   * @param {*} options {hip, femur, knee}
   */
  constructor(options) {
    Object.assign(this, options)
    this.init()
  }

  init() {
    defaultServoPositions.forEach(servoDefaults => {
      this[servoDefaults.name].setSteps(servoDefaults.steps)
    })
  }

  setPosition(t) {
    this.position = t
    this._moveJoints()
  }

  _moveJoints() {
    this.hip.setPosition(this.position.hip)
    this.femur.setPosition(this.position.femur)
    this.knee.setPosition(this.position.knee)
  }
}

module.exports = Leg
