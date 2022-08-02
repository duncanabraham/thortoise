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

  bounds(n) {
    if (n > this.range[1]) {
      n = this.range[1]
    }
    if (n < this.range[0]) {
      n = this.range[0]
    }
  }

  min () {
    this.to(this.range[0])
  }

  max () {
    this.to(this.range[1])
  }

  home () { // where to position the servo when it is powered on
    this.to(this.startAt)
  }

  sleep () { // where to position the servo when it is in sleep mode
    this.to(this.sleepAt)
  }

  stand () { // where to position the servo when it is in stand mode
    this.to(this.standAt)
  }

  to (angle) {
    this.controller.setAngle(this.pin, this.bounds(angle))
  }

  center () {
    this.to(this.max / 2)
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

  shutdown () {
    this._allOff()
  }
}

module.exports = ServoController
