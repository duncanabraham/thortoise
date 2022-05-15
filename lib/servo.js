const { constrain, pad, easeInOutCubic, easeInOutQuad, easeOutCubic, easeInCubic } = require('./utils')

class Servo {
  constructor(options, driver) {
    this.position = 180 // default position can be overridden by the options
    this.driver = driver
    this.ms = 1000
    Object.assign(this, options)
    this.desiredPosition = this.position // When initialised we don't want it to move anywhere so set the desired position to the same as the position
    this.totalSteps = this.steps ? 1 / this.steps : 1
  }

  /**
   * Basic steps, move to 0, 90 or 180 degrees
   * @param {*} p (0 | 1 | 2)
   */
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

  /**
   * Just stop moving
   */
  stop() {
    this.desiredPosition = this.position
    if (this.timingLoop) {
      clearInterval(this.timingLoop)
      delete this.timingLoop
    }
  }

  makeMove() {
    this.driver.setPosition(this.id, this.position) // actually set the servo position
    this.stepCount++
  }

  /**
   * Tween the servo from current to desired positions
   */
  doStepEaseInOut() {
    const easedPosition = Math.floor(easeInOutCubic(this.stepCount, this.originalPosition, this.swing, this.totalSteps))
    this.position = constrain(easedPosition)
    this.makeMove()
  }

  /**
   * Set the angle of this servo
   * @param {*} angle - a number between 0 and 180
   */
  setAbsolutePosition(angle) {
    this.desiredPosition = angle
    this.stepCount = 0
    this.originalPosition = this.position
    this.swing = this.desiredPosition - this.originalPosition
    const loopFunc = this.doStepEaseInOut.bind(this)
    if (!this.timingLoop) {
      this.timingLoop = setInterval(loopFunc, this.ms * this.steps) // keep doing this - until stop() is called
    }
  }
}

module.exports = Servo
