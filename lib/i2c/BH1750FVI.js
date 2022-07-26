const i2cBase = require('./i2cBase')
const { delay } = require('../utils')

/**
 * BH1750FVI Is a Digital Light level sensor
 */

const registers = {
  POWER_DOWN: 0x00000000,
  POWER_ON: 0b00000001,
  RESET: 0b00000111,
  CONTINUOUS_HRES_MODE: 0b00010000,
  CONTINUOUS_HRES_MODE2: 0b00010001,
  CONTINUOUS_LRES_MODE: 0b00010011,
  ONE_TIME_HRES_MODE: 0b00100000,
  ONE_TIME_HRES_MODE2: 0b00100001,
  ONE_TIME_LRES_MODE: 0b00100000
}

const defaults = {
  i2cAddress: 0x23
}

class BH1750FVI extends i2cBase {
  constructor (options = defaults) {
    super({ ...options, group: 'SENSOR' }, registers)
    this._init()
  }

  async _init () {
    this._writeByte(0x00, this.POWER_DOWN)
    this._writeByte(0x00, this.POWER_ON)
    this._writeByte(0x00, this.ONE_TIME_HRES_MODE)
  }

  async readValue () {
    this._init()
    await delay(180)
    this.lastValue = this._readHL(0x00) / 1.2
    this._writeByte(0x00, this.POWER_DOWN)
    return this.lastValue
  }
}


module.exports = BH1750FVI
