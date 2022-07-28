// TODO: Incomplete

const PCA9685BASE = require('./i2c/PCA9685')

class Servo {
  constructor (options, controller) {
    this.controller = controller
    this.startAt = 0
    this.duration = 500
    this.range = [0, 0]
    this._max=180
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

  home () {
    const positionPerc = 100 / this._max * this.startAt
    this.to(positionPerc)
  }

  _step () {

  }

  to (perc) {
    this.controller.setServoPercent(this.pin, perc)
  }

  center () {
    const mid = Math.floor((this.range[1] - this.range[0]) / 2)
    this.to(mid)
  }

  stop () {
    if (this.running) {
      clearInterval(this.running)
      delete this.running
    }
  }
}

class ServoController extends PCA9685BASE {
  constructor (options) {
    super(options)
    this._setPWMFreq(50)
    this.servos = Array(16)
  }

  addServo (options) {
    const servo = new Servo(options, new PCA9685BASE())
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
    this.setDutycycle(this.PWMA, 0)
  }
}

module.exports = ServoController
