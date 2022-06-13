const i2c = require('i2c-bus')
class LPS22HB {
  /**
   * Temperature and Pressure device
   * @param {Byte} i2cAddress
   */
  constructor (i2cAddress) {
    this.lastTemperature = 0
    this.lastPressure = 0
    this.i2cAddress = i2cAddress
    this.temperatureRegister = 0x2B
    this.pressureRegister = 0x28
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

  /**
   *
   * @returns Temperature in °C
   */
  getTemperature () {
    if (this._openI2C()) {
      const l = this.i2cReader.readByteSync(this.i2cAddress, this.temperatureRegister) || 0
      const h = this.i2cReader.readByteSync(this.i2cAddress, this.temperatureRegister + 1) || 0
      this.lastTemperature = (h * 100 + l) / 100
      this._closeI2C()
      return this.lastTemperature
    }
  }

  /**
   * @returns Pressure in hPa
   */
  getPressure () {
    if (this._openI2C()) {
      const x = this.i2cReader.readByteSync(this.i2cAddress, this.pressureRegister) || 0
      const l = this.i2cReader.readByteSync(this.i2cAddress, this.pressureRegister + 1) || 0
      const h = this.i2cReader.readByteSync(this.i2cAddress, this.pressureRegister + 2) || 0
      this.lastPressure = ((h * 65536) + (l * 256) + x) / 4096
      this._closeI2C()
      return this.lastPressure
    }
  }
}

module.exports = LPS22HB
