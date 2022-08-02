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
  TESTMODE: 0xFF,

  RESTART: 0x80,
  SLEEP: 0x10,
  ALLCALL: 0x01,
  INVRT: 0x10,
  OUTDRV: 0x04,
}

const NEUTRAL_PULSE = 1500
const MAX_PULSE = 2100
const MIN_PULSE = 900
const MAX_ANGLE = 90
const GLOBAL_FREQUENCY = 50

const featureOptions = {
  type: 'OPTIONAL',
  group: 'MOTION',
  resumeHandler: () => { },
  pauseHandler: () => { }
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
    this._writeByte(this.registers.MODE1, 0x00)
    this._writeByte(this.registers.MODE2, 0x04)
    this.setPWMFreq(GLOBAL_FREQUENCY)
  }

  async setPWMFreq (freq) {
    const prescale = Math.floor(25000000 / (4096 * freq)) - 1
    this._writeByte(this.registers.MODE1, this.registers.SLEEP)
    this._writeByte(this.registers.PRESCALE, prescale)
    await delay(1)
    this._writeByte(this.registers.MODE1, this.registers.RESTART)
    this._writeByte(this.registers.MODE2, this.registers.OUTDRV)
  }

  setPWM (channel, on, off) {
    console.log('setting pwm: ', channel, on, off)
    // this._writeByte(this.registers.LED0_ON_L + 4 * channel, on & 0xFF)
    // this._writeByte(this.registers.LED0_ON_H + 4 * channel, on >> 8)
    // this._writeByte(this.registers.LED0_OFF_L + 4 * channel, off & 0xFF)
    // this._writeByte(this.registers.LED0_OFF_H + 4 * channel, off >> 8)
    this._writeByte(this.registers.LED0_ON_L + 4 * channel, 0)
    this._writeByte(this.registers.LED0_ON_H + 4 * channel, 0)
    this._writeByte(this.registers.LED0_OFF_L + 4 * channel, 0x88)
    this._writeByte(this.registers.LED0_OFF_H + 4 * channel, 0x08)
  }

  getPWM (channel) {
    return {
      on: this._readByte(this.registers.LED0_ON_L + 4 * channel) + (this._readByte(this.registers.LED0_ON_H + 4 * channel) << 8),
      off: this._readByte(this.registers.LED0_OFF_L + 4 * channel) + (this._readByte(this.registers.LED0_OFF_H + 4 * channel) << 8)
    }
  }

  _stop () {
    this._writeByte(this.registers.ALLLED_OFF_H, 0x00)
    this._writeByte(this.registers.ALLLED_OFF_L, 0x00)
    this._writeByte(this.registers.ALLLED_ON_H, 0x0F)
    this._writeByte(this.registers.ALLLED_ON_L, 0xFF)
  }

  setAngle (channel, angle) {
    const count = angle / 180 * 4096

    this.setPWM(channel, 0, count)
  }

  setCount (channel, count) {
    this.setPWM(channel, 0, count)
  }
}

module.exports = PCA9685BASE
