const i2cBase = require('./i2cBase')
const log = require('../log') // Change to actual path

class UPS extends i2cBase {
  constructor(options = {}, additional = {}) {
    options.group = 'HAT'
    options.type = 'CORE'
    super(options, additional)
    this.data = null
  }

  async init() {
    // Initialize the chip with known config values
    this._calValue = 0
    this._currentLsb = 0
    this._powerLsb = 0

    // You can call a method similar to setCalibration32V2A() here
    // Or include the initialization logic directly within init()

    try {
      this._writeWord(0x00, 0x399F) // Replace these with your actual register and values
      this._writeWord(0x05, 0x7000)
    } catch (error) {
      log.error('Error during initialization:', error)
    }
  }

  async readData() {
    try {
      // Read shunt voltage
      const shuntVoltage = this._readWord(0x01) // Change 0x01 to actual register address for shunt voltage
      // Read bus voltage
      const busVoltage = this._readWord(0x02) // Change 0x02 to actual register address for bus voltage
      // Read current
      const current = this._readWord(0x04) // Change 0x04 to actual register address for current

      // Convert to real-world units if necessary

      this.data = {
        shuntVoltage,
        busVoltage,
        current
      }
      console.log('read UPS data: ', this.data)
    } catch (error) {
      log.error('Error reading from INA219:', error)
      return null
    }
  }
}

module.exports = UPS

