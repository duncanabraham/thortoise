const i2c = require('i2c-bus')

class Motor {
  constructor(options = {}) {
    this.direction = 0
    this.speed = 0
    Object.assign(this, options)
  }

}

/**
 * The MotorDriverHat is a dual motor controller from Waveshare
 * https://www.waveshare.com/wiki/Motor_Driver_HAT
 */
class MotorDriver {
  constructor(options = { i2cAddress: 0x40 }) {
    Object.assign(this, options)
    this.motors = [new Motor({name: 'M0'}), new Motor({name: 'M1'})]
  }

}

module.exports = MotorDriver
