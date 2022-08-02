// TODO: Incomplete

const PCA9685 = require('./i2c/PCA9685')

class Servo {
  constructor (options, controller) {
    this.controller = controller
    this.startAt = 0
    this._max = 180
    this.range = [0, 180]
    Object.assign(this, options)
    this.currentPosition = this.startAt
  }

  min () {
    const minValuePerc = 100 / this._max * this.range[0]
    this.to(minValuePerc)
  }

  max () {
    const maxValuePerc = 100 / this._max * this.range[1]
    this.to(maxValuePerc)
  }

  home () { // where to position the servo when it is powered on
    const positionPerc = 100 / this._max * this.startAt
    this.to(positionPerc)
  }

  sleep () { // where to position the servo when it is in sleep mode
    const positionPerc = 100 / this._max * this.sleepAt
    this.to(positionPerc)
  }

  stand () { // where to position the servo when it is in stand mode
    const positionPerc = 100 / this._max * this.standAt
    this.to(positionPerc)
  }

  to (perc) {
    this.controller.setServoPercent(this.pin, (1/perc) * 4096)
  }

  center () {
    const mid = Math.floor((this.range[1] - this.range[0]) / 2)
    const positionPerc = 100 / this._max * mid
    this.to(positionPerc)
  }

  stop () {
    this.controller._init()
  }
}

class ServoController extends PCA9685 {
  constructor (options) {
    super(options)
    this.servos = Array(16)
  }

  addServo (options) {
    const servo = new Servo(options, this)
    this.servos[servo.pin] = servo
    return servo
  }

  min (channel) {
    this.servos[channel].min()
  }

  max (channel) {
    this.servos[channel].max()
  }

  home (channel) {
    this.servos[channel].home()
  }

  to (channel, angle) {
    this.servos[channel].to(angle)
  }

  center (channel) {
    this.servos[channel].center()
  }

  stop (channel) {
    this.servos[channel].stop()
  }

  async shutdown () {
    await this._allOff()
  }
}

module.exports = ServoController
