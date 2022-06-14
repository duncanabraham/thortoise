const i2c = require('i2c-bus')
const { delay } = require('./utils')

/**
 * The PCA9685S16CH 16 Channel Servo Driver
 * https://www.waveshare.com/wiki/Servo_Driver_HAT
 *
 */
class PCA9685S16CH {
  constructor (options = { i2cAddress: 0x40 }) {
    Object.assign(this, options)
  }

  _openI2C () {
    if (!this.i2cOpen) {
      this.i2cOpen = true
      this.i2cReader = i2c.openSync(1)
      return true
    } else {
      return false
    }
  }

  _closeI2C () {
    if (this.i2cOpen) {
      this.i2cReader.closeSync()
      this.i2cOpen = false
    }
  }
}

module.exports = PCA9685S16CH
