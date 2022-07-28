const i2cBase = require('./i2cBase')
const { delay } = require('../utils')

const registers = {
  MODE1: 0x00,
  MODE2: 0x01,
  SUBADR1: 0x02,
  SUBADR2: 0x03,
  SUBADR3: 0x04,
  ALLCALLADR: 0x05,
  LED0_ON_L: 0x06,
  LED0_ON_H: 0x07,
  LED0_OFF_L: 0x08,
  LED0_OFF_H: 0x09,
  // ...
  ALLLED_ON_L: 0xFA,
  ALLLED_ON_H: 0xFB,
  ALLLED_OFF_L: 0xFC,
  ALLLED_OFF_H: 0xFD,
  PRESCALE: 0xFE,
  TESTMODE: 0xFF
}

const featureOptions = {
  type: 'OPTIONAL',
  group: 'MOTION',
  resumeHandler: () => {},
  pauseHandler: () => {}
}

/**
 * The PCA9685BASE is the raw PWM controller used by servos and motor controllers
 */
class PCA9685BASE extends i2cBase {
  constructor (options = { i2cAddress: 0x40, ...featureOptions }) {
    super(options, { registers })
    this._init()
  }

  _init () {
    this._writeByte(this.registers.MODE1, 0)
  }

  async _setPWMFreq (freq) {
    const prescale = Math.floor(25000000.0 / 4096.0 / freq + 0.5) // 25MHz

    const oldMode = await this._readByte(this.registers.MODE1)
    console.log('old mode: ', oldMode)
    const newMode = (oldMode & 0x7F) | 0x10
    console.log('new mode: ', newMode)
    await this._writeByte(this.registers.MODE1, newMode)
    await this._writeByte(this.registers.PRESCALE, prescale)
    await this._writeByte(this.registers.MODE1, oldMode)
    delay(1)
    await this._writeByte(this.registers.MODE1, oldMode | 0xa1) // Mode 1, autoincrement on
    console.log('old mode+: ', oldMode | 0xa1)
  }

  async _setPWM (channel, on, off) {
    await this._writeByte(this.registers.LED0_ON_L + 4 * channel, on & 0xFF)
    await this._writeByte(this.registers.LED0_ON_H + 4 * channel, 0xff & (on >> 8))
    await this._writeByte(this.registers.LED0_OFF_L + 4 * channel, off & 0xFF)
    await this._writeByte(this.registers.LED0_OFF_H + 4 * channel, 0xff & (off >> 8))
  }

  _setServoPulse (channel, pulse) {
    pulse = Math.floor(pulse * 4096 / 20000)
    this._setPWM(channel, 0, pulse)
  }

  _setDutyCycle (channel, pulse) {
    this._setPWM(channel, 0, pulse * Math.floor(4096 / 100))
  }

  _setLevel (channel, value) {
    if (value === 1) {
      this._setPWM(channel, 0, 4095)
    } else {
      this._setPWM(channel, 0, 0)
    }
  }
}

module.exports = PCA9685BASE
