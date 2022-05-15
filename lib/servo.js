const { constrain, pad, easeInOutCubic, easeInOutQuad, easeOutCubic, easeInCubic } = require('./utils')

class Servo {
  constructor(options, driver) {
    // the servo will tween over 1 second (1000ms) unless this is set to another value in the options
    this.position = 180 // default position can be overridden by the options
    this.driver = driver
    this.ms = 1000
    Object.assign(this, options)
    // When initialised we don't want it to move anywhere
    this.desiredPosition = this.position
    this.totalSteps = this.steps ? 1 / this.steps : 1
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
    this.totalSteps = 1 / this.steps
  }

  getSteps() {
    return this.steps
  }

  makeMove() {
    this.driver.setPosition(this.id, this.position) // actually set the servo position
    this.stepCount++
    // if (this.debug) {
    //   console.log(pad(this.name, 10, true), pad(this.originalPosition,3), pad(this.position,3), pad(this.desiredPosition, 3), pad(this.stepCount, 3), pad(this.totalSteps, 3))
    // }
  }

  /**
   * Step the position as an incremental step towards the desired position
   */
  doStep() {
    this.position = constrain(Math.floor(this.position + this.stepSize))
    this.makeMove()
  }

  doStepEaseInOut() {
    const easedPosition = Math.floor(easeInOutCubic(this.stepCount, this.originalPosition, this.swing, this.totalSteps))
    this.position = constrain(easedPosition)
    this.makeMove()
  }

  doStepEaseQuad() {
    const easedPosition = Math.floor(easeInOutQuad(this.stepCount, this.originalPosition, this.swing, this.totalSteps))
    this.position = constrain(easedPosition)
    this.makeMove()
  }

  doStepEaseOutCubic() {
    const easedPosition = Math.floor(easeOutCubic(this.stepCount, this.originalPosition, this.swing, this.totalSteps))
    this.position = constrain(easedPosition)
    this.makeMove()
  }

  doStepEaseInCubic() {
    const easedPosition = Math.floor(easeInCubic(this.stepCount, this.originalPosition, this.swing, this.totalSteps))
    this.position = constrain(easedPosition)
    this.makeMove()
  }

  setAbsolutePosition(p) {
    this.desiredPosition = p
    this.stepCount = 0
    this.originalPosition = this.position
    this.swing = this.desiredPosition - this.originalPosition

    // Work out the amount to change the current position towards the desired position
    const multiplier = this.position < this.desiredPosition ? 1 : -1
    this.stepSize = Math.floor((Math.abs(this.desiredPosition - this.position) * this.steps) * multiplier)

    if (this.debug) {
      console.log(`${new Date().toISOString()}: move ${pad(this.name, 10, true)} from: ${pad(this.position, 4)} to ${pad(this.desiredPosition, 4)} in steps of ${pad(this.stepSize, 4)} every ${pad(this.ms * this.steps, 4)}ms`)
    }

    const loopFunc = this.doStepEaseInOut.bind(this)
    if (!this.timingLoop) {
      this.timingLoop = setInterval(loopFunc, this.ms * this.steps)
    }
  }
}

module.exports = Servo
