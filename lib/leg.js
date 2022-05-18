const Servo = require('./servo')
const Triplet = require('./triplet')
class Leg {
  /**
   * A leg has 3 servos which can be different types
   * @param {*} options {id, driver, servo: settings specific to this type of servo}
   */
  constructor (options) {
    Object.assign(this, options)
    this.baseId = this.id * 3
    this._init()
  }

  _createLegs () {
    this.hip = new Servo({ id: this.baseId, name: `hip${this.baseId}`, ...this.hipServoSettings }, this.driver)
    this.femur = new Servo({ id: this.baseId + 1, name: `femur${this.baseId}`, ...this.femurServoSettings }, this.driver)
    this.knee = new Servo({ id: this.baseId + 2, name: `knee${this.baseId}`, ...this.kneeServoSettings }, this.driver)
  }

  _init () {
    this._createLegs()
  }

  /**
   * Set the leg joints to specific angles
   * @param {triplet} t {hip, femmur, knee} values for each angle
   */
  setAngles (t) {
    console.log('set angles: ', t)
    return new Promise(resolve => {
      this._setJoints(t).then(resolve)
    })
  }

  _setJoints (t) {
    this.position = t
    this.hip.setAbsolutePosition(this.position.hip)
    this.femur.setAbsolutePosition(this.position.femur)
    this.knee.setAbsolutePosition(this.position.knee)
    let pollCount = 0
    const self = this
    return new Promise((resolve) => { // poll to see if the joints reach their destination
      const currentPosition = new Triplet(this.position.hip, this.position.femur, this.position.knee)
      ;(function waitForLegs () {
        if (currentPosition.equals(self.position || pollCount > 1000)) return resolve()
        pollCount++
        setTimeout(waitForLegs, 2)
      })()
    })
  }

  /**
   * Set the leg joints to set angles
   * @param {triplet} t {hip, femur, knee} values in steps: 0, 1 or 2
   */
  setPosition (t) {
    this.position = t
    this._moveJoints()
  }

  _moveJoints () {
    this.hip.setPosition(this.position.hip)
    this.femur.setPosition(this.position.femur)
    this.knee.setPosition(this.position.knee)
  }
}

module.exports = Leg
