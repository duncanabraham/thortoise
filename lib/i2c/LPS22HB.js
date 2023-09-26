const I2cBase = require('./i2cBase')

/**
 * The LPS22HB is a temperature and pressure sensor
 * This is part of the Waveshare Sense Hat for the Raspberry Pi
 * https://www.waveshare.com/wiki/Sense_HAT_(B)
 */
const log = require('../log')

const registers = {
  LPS22HB_I2C_ADDRESS: 0x5C,
  LPS_CTRL_REG1: 0x10,
  LPS_CTRL_REG2: 0x11,
  LPS_STATUS: 0x27,
  LPS_PRESS_OUT_XL: 0x28,
  LPS_TEMP_OUT_L: 0x2B
}

class LPS22HB extends I2cBase {
  constructor (options = { i2cAddress: registers.LPS22HB_I2C_ADDRESS }) {
    super(options, {})

    this._reset()
    this._writeByte(registers.LPS_CTRL_REG1, 0x02, 'LPS22HB:Constructor():1')
  }

  _reset () {
    let Buf = this._readWord(registers.LPS_CTRL_REG2)
    Buf |= 0x04
    this._writeByte(registers.LPS_CTRL_REG2, Buf, 'LPS22HB:_reset():1')

    while (Buf) {
      Buf = this._readWord(this.LPS_CTRL_REG2)
      Buf &= 0x04
    }
  }

  startOneshot () {
    let Buf = this._readWord(registers.LPS_CTRL_REG2)
    Buf |= 0x01
    this._writeByte(registers.LPS_CTRL_REG2, Buf, 'LPS22HB:startOneShot():1')
  }

  getPressure () {
    this.startOneshot()
    if (this._readByte(registers.LPS_STATUS) & 0x01) {
      const xl = this._readByte(registers.LPS_PRESS_OUT_XL)
      const l = this._readByte(registers.LPS_PRESS_OUT_XL + 1)
      const h = this._readByte(registers.LPS_PRESS_OUT_XL + 2)
      return ((h << 16) + (l << 8) + xl) / 4096.0
    }
    return null
  }

  getTemperature () {
    this.startOneshot()
    if (this._readByte(registers.LPS_STATUS) & 0x02) {
      const l = this._readByte(registers.LPS_TEMP_OUT_L)
      const h = this._readByte(registers.LPS_TEMP_OUT_L + 1)
      return ((h << 8) + l) / 100.0
    }
    return null
  }

  get temperature () {
    return this.getTemperature()
  }

  get pressure () {
    return this.getPressure()
  }
}

// Test
if (require.main === module) {
  const sensor = new LPS22HB()
  setInterval(() => {
    const pressure = sensor.getPressure()
    const temperature = sensor.getTemperature()
    log.info(`Pressure = ${pressure} hPa , Temperature = ${temperature} °C`)
  }, 100)
}

module.exports = LPS22HB
