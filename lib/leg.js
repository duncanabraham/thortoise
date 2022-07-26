const Feature = require('./feature')
const { Pos } = require('./pos')
const { move: kinematicsMove } = require('./kinematics')
const ServoController = require('./ServoController')

const servoController = new ServoController()

const featureOptions = {
  type: 'OPTIONAL',
  group: 'MOTION',
  resumeHandler: () => {},
  pauseHandler: () => {}
}

/* It creates a leg with 3 servos and then moves them to the correct position */
class Leg extends Feature {
  /**
   * A leg has 3 servos which can be different types
   * @param {*} options {id, servo: settings specific to this type of servo}
   */
  constructor (options) {
    super(featureOptions)
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

  /**
   * It creates the servos for the leg
   */
  _createLegs () {
    this.servos.hip = servoController.addServo({ pin: this.baseId, name: `hip${this.baseId}`, ...this.hipServoSettings })
    this.servos.femur = servoController.addServo({ pin: this.baseId + 1, name: `femur${this.baseId}`, ...this.femurServoSettings })
    this.servos.knee = servoController.addServo({ pin: this.baseId + 2, name: `knee${this.baseId}`, ...this.kneeServoSettings })
  }

  /**
   * It creates a new position object with the startAt values for each servo. It then calls the
   * _createLegs function and then calls the home function.
   */
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
    await this.stand()
  }

  /**
   * Return to the shutdown position
   */
  sleep () {
    return new Promise(resolve => {
      Object.keys(this.servos).forEach(key => {
        this.servos[key].to(this.servos[key].sleepAt)
      })
      resolve()
    })
  }

  stand () {
    return new Promise(resolve => {
      Object.keys(this.servos).forEach(joint => {
        this.servos[joint].to(this.servos[joint].standAt)
      })
    })
  }

  /**
   * It stops all the servos
   */
  stop () {
    Object.keys(this.servos).forEach(key => {
      this.servos[key].stop()
    })
    this.direction = 'stop'
  }

  /**
   * It returns a promise that resolves when all the servos have been homed
   * @returns A promise that will resolve when all the servos have been homed.
   */
  home () {
    return new Promise(resolve => {
      Object.keys(this.servos).forEach(key => {
        this.servos[key].home()
      })
      resolve()
    })
  }

  /**
   * It moves all the servos to their minimum position.
   * @returns A promise that will resolve when all servos have been set to their minimum position.
   */
  min () {
    Object.keys(this.servos).forEach(key => {
      this.servos[key].min()
    })
  }

  /**
   * It sets the servos to their maximum position.
   * @returns A promise that will resolve when all servos have reached their max position.
   */
  max () {
    Object.keys(this.servos).forEach(key => {
      this.servos[key].max()
    })
  }

  directionFromStep (step) {
    if (!this.step) {
      this.step = step
    }
    const d = this.direction === 'forward' ? 1 : this.direction === 'backward' ? -1 : 0
    this.step += d
    this.step = this.step < 0 ? this.step + this.steps : this.step
    this.step = this.step > this.steps - 1 ? this.step - this.steps - 1 : this.step
    return this.step
  }

  /**
   * It takes a step, finds the direction of the next step, and then moves the robot to that position
   * @param step - the step to be taken
   */
  nextStep (step = 0) {
    const nextStep = this.directionFromStep(step)
    this.newAngles = kinematicsMove(this.position, nextStep)
    this._move()
  }

  /**
   * > The function `_move` is called when the direction is either `forward` or `backward`. It sets the
   * servo angles to the values of `x`, `y`, and `z` which are calculated in the `_calculateAngles`
   * function
   */
  _move () {
    if (['forward', 'backward'].includes(this.direction)) {
      const { x, y, z } = this.newAngles
      this.servos.hip.to(x)
      this.servos.femur.to(y)
      this.servos.knee.to(z)
    }
  }
}

module.exports = Leg
