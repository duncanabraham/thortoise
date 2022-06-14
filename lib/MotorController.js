const PCA9685BASE = require('./PCA9685BASE')

/**
 * The PCA9685MC is a dual motor controller from Waveshare
 * https://www.waveshare.com/wiki/Motor_Driver_HAT
 * Translated from the Python example code provided by Waveshare
 *
 * Usage:
 *
 * driver = new PCA9685
 * driver.run(0, 'forward', 100) // M0, Full speed forward
 * driver.run(1, 'backward', 50) // M1. Half speed backwards
 * driver.stop(0) // M0, stop!
 *
 * `run` and `stop` are the only public methods required
 *
 */
class MotorController extends PCA9685BASE {
  constructor (options = { i2cAddress: 0x40 }) {
    super(options)

    this.PWMA = 0
    this.AIN1 = 1
    this.AIN2 = 2

    this.PWMB = 5
    this.BIN1 = 3
    this.BIN2 = 4
  }

  run (motor, index, speed) {
    if (speed > 100) { speed = 100 }
    if (motor === 0) { // M0
      this.setDutycycle(this.PWMA, speed)
      if (index === 'forward') {
        this._setLevel(this.AIN1, 0)
        this._setLevel(this.AIN2, 1)
      } else {
        this._setLevel(this.AIN1, 1)
        this._setLevel(this.AIN2, 0)
      }
    } else { // M1
      this.setDutycycle(this.PWMB, speed)
      if (index === 'forward') {
        this._setLevel(this.BIN1, 0)
        this._setLevel(this.BIN2, 1)
      } else {
        this._setLevel(this.BIN1, 1)
        this._setLevel(this.BIN2, 0)
      }
    }
  }

  stop (motor) {
    if (motor === 0) {
      this.setDutycycle(this.PWMA, 0)
    } else {
      this.setDutycycle(this.PWMB, 0)
    }
  }
}

module.exports = MotorController
