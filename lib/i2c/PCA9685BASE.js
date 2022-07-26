const i2cBase = require('./i2cBase')
const { delay } = require('../utils')

const registers = {
  SUBADR1: 0x02,
  SUBADR2: 0x03,
  SUBADR3: 0x04,
  MODE1: 0x00,
  PRESCALE: 0xFE,
  LED0_ON_L: 0x06,
  LED0_ON_H: 0x07,
  LED0_OFF_L: 0x08,
  LED0_OFF_H: 0x09,
  ALLLED_ON_L: 0xFA,
  ALLLED_ON_H: 0xFB,
  ALLLED_OFF_L: 0xFC,
  ALLLED_OFF_H: 0xFD
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

  _setPWMFreq (freq) {
    let prescale = 25000000.0 // 25MHz
    prescale = prescale / 4096.0 // 12-bit
    prescale = Math.floor((prescale / freq) - 0.5)
    const oldMode = this._readByte(this.registers.MODE1)
    const newMode = (oldMode & 0x7F) | 0x10
    this._writeByte(this.registers.MODE1, newMode)
    this._writeByte(this.registers.PRESCALE, prescale)
    this._writeByte(this.registers.MODE1, oldMode)
    delay(5)
    this._writeByte(this.registers.MODE1, oldMode | 0x80)
  }

  _setPWM (channel, on, off) {
    this._writeByte(this.registers.LED0_ON_L + 4 * channel, on & 0xFF)
    this._writeByte(this.registers.LED0_ON_H + 4 * channel, 0xff & (on >> 8))
    this._writeByte(this.registers.LED0_OFF_L + 4 * channel, off & 0xFF)
    this._writeByte(this.registers.LED0_OFF_H + 4 * channel, 0xff & (off >> 8))
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
