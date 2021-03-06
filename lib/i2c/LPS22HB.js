const i2c = require('i2c-bus')
/**
 * The LPS22HB is a temperature and pressure sensor
 * This is part of the Waveshare Sense Hat for the Raspberry Pi
 * https://www.waveshare.com/wiki/Sense_HAT_(B)
 */
class LPS22HB {
  /**
   * Temperature and Pressure device
   * @param {Byte} i2cAddress
   */
  constructor (options = { i2cAddress: 0x5C }) {
    options.group = 'SENSOR'
    this.lastTemperature = 0
    this.lastPressure = 0
    this.statusRegister = 0x27
    this.temperatureRegister = 0x2B
    this.pressureRegister = 0x28
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

  _getStatus () {
    if (this._openI2C()) {
      return this.i2cReader.readByteSync(this.i2cAddress, this.statusRegister) || 0
    } else {
      return 0
    }
  }

  /**
   * Update the internal values if they're available
   */
  update () {
    const status = this._getStatus()
    const hasPressureValue = 1
    const hasTemperatureValue = 2
    if ((status & hasPressureValue) === hasPressureValue) {
      const x = this.i2cReader.readByteSync(this.i2cAddress, this.pressureRegister) || 0
      const l = this.i2cReader.readByteSync(this.i2cAddress, this.pressureRegister + 1) || 0
      const h = this.i2cReader.readByteSync(this.i2cAddress, this.pressureRegister + 2) || 0
      this.lastPressure = ((h * 65536) + (l * 256) + x) / 4096
    }
    if ((status & hasTemperatureValue) === hasTemperatureValue) {
      const l = this.i2cReader.readByteSync(this.i2cAddress, this.temperatureRegister) || 0
      const h = this.i2cReader.readByteSync(this.i2cAddress, this.temperatureRegister + 1) || 0
      this.lastTemperature = (h * 100 + l) / 100
    }
    this._closeI2C()
  }

  /**
   * @returns Temperature in °C
   */
  getTemperature () {
    if ((this._getStatus() & 2) === 2) { // Status 2 = has temp reading
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
    if ((this._getStatus() & 1) === 1) { // status 1 = has pressure reading
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
