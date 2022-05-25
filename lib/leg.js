const { Pos } = require('./pos')
const { move } = require('./kinematics')
const { delay } = require('./utils')
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
    this.direction = 'forward'
  }

  setDirection (d) {
    this.direction = d
  }

  _createLegs () {
    const { makeServo } = this.driver
    this.servos.hip = makeServo({ pin: this.baseId, name: `hip${this.baseId}`, ...this.hipServoSettings })
    this.servos.femur = makeServo({ pin: this.baseId + 1, name: `femur${this.baseId}`, ...this.femurServoSettings })
    this.servos.knee = makeServo({ pin: this.baseId + 2, name: `knee${this.baseId}`, ...this.kneeServoSettings })
    this.position = new Pos(
      this.hipServoSettings.startAt,
      this.femurServoSettings.startAt,
      this.kneeServoSettings.startAt,
      this.name,
      this.startPos,
      this.femurLength,
      this.tibiaLength
    )
    const { t1, t2, t3 } = this.position
    console.log(`initial settings: ${t1}, ${t2}, ${t3}`)
  }

  async _init () {
    this._createLegs()
    this.min()
    await delay(2000)
    this.max()
    await delay(2000)
    this.home()
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
    Object.keys(this.servos).forEach(key => {
      this.servos[key].home()
    })
  }

  min () {
    Object.keys(this.servos).forEach(key => {
      this.servos[key].min()
    })
  }

  max () {
    Object.keys(this.servos).forEach(key => {
      this.servos[key].max()
    })
  }

  nextStep (step) {
    let newAngles
    const {t1: a, t2: b, t3: c} = this.position
    switch (this.direction) {
      case 'forward':
        newAngles = move(this.position, step)
        break
      case 'backward':
        this.position.setAngles(move(this.position, step - 1))
        break
    }

    // const { t1, t2, t3 } = newAngles
    // console.log(`${a}, ${b}, ${c},  ->  ${t1}, ${t2}, ${t3}`)
    this._move(newAngles)
  }

  /**
   * Set the leg joints to specific angles
   * @param {Pos} pos hip, femur, knee and limb lengths
   * @param {number} ms The number of milliseconds to take to perform the move
   */
  _move (newAngles) {
    const { t1, t2, t3 } = newAngles
    if (this.name === 'front-left') {
      console.log(`${t1}, ${t2}, ${t3}`)
    }
    this.servos.hip.to(t1)
    this.servos.femur.to(t2)
    this.servos.knee.to(t3)
  }
}

module.exports = Leg
