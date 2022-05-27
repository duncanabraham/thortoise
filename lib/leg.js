const { Pos } = require('./pos')
const { move } = require('./kinematics')
// const { delay } = require('./utils')
class Leg {
  /**
   * A leg has 3 servos which can be different types
   * @param {*} options {id, driver, servo: settings specific to this type of servo}
   */
  constructor (options) {
    this.steps = 72
    Object.assign(this, options)
    this.servos = {}
    this.baseId = this.id * 3
    this.step = 0
    this._init()
  }

  setDirection (d) {
    this.direction = d
  }

  getDirection () {
    return this.direction
  }

  _createLegs () {
    const { makeServo } = this.driver
    this.servos.hip = makeServo({ pin: this.baseId, name: `hip${this.baseId}`, ...this.hipServoSettings })
    this.servos.femur = makeServo({ pin: this.baseId + 1, name: `femur${this.baseId}`, ...this.femurServoSettings })
    this.servos.knee = makeServo({ pin: this.baseId + 2, name: `knee${this.baseId}`, ...this.kneeServoSettings })
  }

  async _init () {
    this.position = new Pos(
      this.hipServoSettings.startAt,
      this.femurServoSettings.startAt,
      this.kneeServoSettings.startAt,
      this.name,
      this.startPos,
      this.femurLength,
      this.tibiaLength
    )
    this._createLegs()
    await this.home()
  }

  /**
   * Return to the shutdown position
   */
  sleep () {
    return new Promise(resolve => {
      for (const key of Object.keys(this.servos)) {
        this.servos[key].to(this.servos[key].sleepAt)
      }
      resolve()
    })
  }

  /**
   * Stop all the servos - KILL
   */
  stop () {
    Object.keys(this.servos).forEach(key => {
      this.servos[key].stop()
    })
    this.direction = 'stop'
  }

  /**
   * Return all the servos to their start position
   */
  home () {
    return new Promise(resolve => {
      Object.keys(this.servos).forEach(key => {
        this.servos[key].home()
      })
      resolve()
    })
  }

  min () {
    return new Promise(resolve => {
      Object.keys(this.servos).forEach(key => {
        this.servos[key].min()
      })
      resolve()
    })
  }

  max () {
    return new Promise(resolve => {
      Object.keys(this.servos).forEach(key => {
        this.servos[key].max()
      })
      resolve()
    })
  }

  directionFromStep (step) {
    if (!this.step) {
      this.step = step
    }
    const d = this.direction === 'forward' ? 1 : -1
    this.step += d
    this.step = this.step < 0 ? this.step + this.steps : this.step
    this.step = this.step > this.steps - 1 ? this.step - this.steps : this.step
    return this.step
  }

  nextStep (step) {
    const nextStep = this.directionFromStep(step)
    this.newAngles = move(this.position, nextStep)
    this._move()
  }

  /**
   * Set the leg joints to specific angles
   * @param {Pos} pos hip, femur, knee and limb lengths
   * @param {number} ms The number of milliseconds to take to perform the move
   */
  _move () {
    if (['forward', 'backward'].includes(this.direction)) {
      const { t1, t2, t3 } = this.newAngles
      this.servos.hip.to(t1)
      this.servos.femur.to(t2)
      this.servos.knee.to(t3)
    }
  }
}

module.exports = Leg
