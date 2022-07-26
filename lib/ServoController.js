// TODO: Incomplete

const PCA9685BASE = require('./i2c/PCA9685BASE')

class Servo {
  constructor (options) {
    this.startAt = 0
    this.duration = 500
    this.range = [0, 0]
    Object.assign(this, options)
    this.currentPosition = this.startAt
  }

  min () {
    this.to(this.range[0])
  }

  max () {
    this.to(this.range[1])
  }

  home () {
    this.to(this.startAt)
  }

  _step () {

  }

  to (angle) {
    if (angle < this.range[0]) { angle = this.range[0] }
    if (angle > this.range[1]) { angle = this.range[1] }
    if (this.running) { this.stop() }
    if (this.currentPosition > angle) { this.direction = 1 }
    if (this.currentPosition < angle) { this.direction = -1 }
    this.stepSize = Math.abs(this.currentPosition - angle)
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
    const servo = new Servo(options)
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
