const i2cBase = require('./i2cBase')

/**
 * The LPS22HB is a temperature and pressure sensor
 * This is part of the Waveshare Sense Hat for the Raspberry Pi
 * https://www.waveshare.com/wiki/Sense_HAT_(B)
 */
class LPS22HB extends i2cBase {
  /**
   * Temperature and Pressure device
   * @param {Byte} i2cAddress
   */
  constructor(options = { i2cAddress: 0x5C }) {
    options.group = 'SENSOR'
    super({ ...options })
    this.lastTemperature = 0
    this.lastPressure = 0
    this.statusRegister = 0x27
    this.temperatureRegister = 0x2B
    this.pressureRegister = 0x28
    this.ctrlReg1 = 0x10
    this.init()
  }

  init() {
    if (this._openI2C()) {
      // Set Control Register 1 to power down mode (default state)
      this.i2c.writeByteSync(this.i2cAddress, this.ctrlReg1, 0x00)

      // Configure the sensor for pressure and temperature measurements
      this.i2c.writeByteSync(this.i2cAddress, this.ctrlReg1, 0x03)
    }
  }

  _getStatus() {
    if (this._openI2C()) {
      const status = this.i2c.readByteSync(this.i2cAddress, this.statusRegister) || 0
      console.log('status: ', status)
      return status
    } else {
      return 0
    }
  }

  /**
   * Update the internal values if they're available
   */
  update() {
    const status = this._getStatus()
    const hasPressureValue = 1
    const hasTemperatureValue = 2
    if ((status & hasPressureValue) === hasPressureValue) {
      const x = this.i2c.readByteSync(this.i2cAddress, this.pressureRegister) || 0
      const l = this.i2c.readByteSync(this.i2cAddress, this.pressureRegister + 1) || 0
      const h = this.i2c.readByteSync(this.i2cAddress, this.pressureRegister + 2) || 0
      const value = (h << 16) | (l << 8) | x
      this.lastPressure = (this._twosComp(value)) / 4096
    }
    if ((status & hasTemperatureValue) === hasTemperatureValue) {
      const l = this.i2c.readByteSync(this.i2cAddress, this.temperatureRegister) || 0
      const h = this.i2c.readByteSync(this.i2cAddress, this.temperatureRegister + 1) || 0
      this.lastTemperature = (h * 100 + l) / 100
    }
    this._closeI2C()
  }

  /**
   * @returns Temperature in °C
   */
  getTemperature() {
    if ((this._getStatus() & 2) === 2) { // Status 2 = has temp reading
      const l = this.i2c.readByteSync(this.i2cAddress, this.temperatureRegister) || 0
      const h = this.i2c.readByteSync(this.i2cAddress, this.temperatureRegister + 1) || 0
      this.lastTemperature = (h * 100 + l) / 100
      this._closeI2C()
      return this.lastTemperature
    } else {
      return -1
    }
  }

  /**
   * @returns Pressure in hPa
   */
  getPressure() {
    if ((this._getStatus() & 1) === 1) { // status 1 = has pressure reading
      const x = this.i2c.readByteSync(this.i2cAddress, this.pressureRegister) || 0
      const l = this.i2c.readByteSync(this.i2cAddress, this.pressureRegister + 1) || 0
      const h = this.i2c.readByteSync(this.i2cAddress, this.pressureRegister + 2) || 0
      this.lastPressure = ((h * 65536) + (l * 256) + x) / 4096
      this._closeI2C()
      return this.lastPressure
    } else {
      return -1
    }
  }
}

module.exports = LPS22HB
