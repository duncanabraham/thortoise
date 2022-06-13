const i2c = require('i2c-bus')

class LPS22HB {
  constructor (options) {
    this.I2CAddress = options.address
    this.temperatureRegister = 0x2B
    this.pressureRegister =
  }

  getTemperature() {

  }
}

module.exports = LPS22HB
