const { constrain, pad } = require('./utils')

class Servo {
  constructor(options, driver) {
    // the servo will tween over 1 second (1000ms) unless this is set to another value in the options
    this.position = 180 // default position can be overridden by the options
    this.driver = driver
    this.ms = 1000
    Object.assign(this, options)
    // When initialised we don't want it to move anywhere
    this.desiredPosition = this.position
  }

  setPosition(p) { // 0 = 180, 1 = 90, 2 = 0
    p = !p ? 0 : p
    const position = constrain(180 - (90 * p))
    this.setAbsolutePosition(position)
  }

  getPosition() {
    return this.position
  }

  setSteps(s) {
    this.steps = s
  }

  getSteps() {
    return this.steps
  }

  /**
   * Step the position as an incremental step towards the desired position
   */
  doStep() {
    this.position = constrain(Math.floor(this.position + this.stepSize))
    this.driver.setPosition(this.id, this.position) // actually set the servo position
    if (this.debug) {
      console.log(this.name, this.position, this.desiredPosition, this.stepSize)
    }
  }

  setAbsolutePosition(p) {
    this.desiredPosition = p

    // Work out the amount to change the current position towards the desired position
    let multiplier = this.position < this.desiredPosition ? 1 : -1
    this.stepSize = Math.floor((Math.abs(this.desiredPosition - this.position) * this.steps) * multiplier)

    if (this.debug) {
      console.log(`${new Date().toISOString()}: move ${this.name} from: ${pad(this.position, 4)} to ${pad(this.desiredPosition, 4)} in steps of ${pad(this.stepSize, 4)} every ${pad(this.ms * this.steps, 4)}ms`)
    }

    const loopFunc = this.doStep.bind(this)
    if (!this.timingLoop) {
      this.timingLoop = setInterval(loopFunc, this.ms * this.steps)
    }
  }
}

module.exports = Servo
