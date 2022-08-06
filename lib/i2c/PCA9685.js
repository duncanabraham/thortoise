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
  SLEEP: 0x08,
  ALLCALL: 0x01,
  INVRT: 0x10,
  OUTDRV: 0x04
}

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
    // this._writeByte(this.registers.MODE1, 0x00)
    // this._writeByte(this.registers.MODE2, 0x04)
    this.setPWMFreq(GLOBAL_FREQUENCY)
  }

  async setPWMFreq (freq) {
    // // const prescale = Math.floor(25000000 / (4096 * freq)) - 1
    // this._writeByte(this.registers.MODE1, this.registers.SLEEP)
    // await delay(1)
    // this._writeByte(this.registers.MODE1, 0x10)
    // this._writeByte(this.registers.PRESCALE, 0x80)
    // await delay(1)
    // this._writeByte(this.registers.MODE1, this.registers.RESTART + 1)
    // // this._writeByte(this.registers.MODE2, this.registers.OUTDRV)
    this._writeByte(0xfe, 0x80) // prescale
    await delay(1)
    this._writeByte(0x06, 0x00) // on value = 0
  }

  setPWM (channel, on, off) {
    console.log('setting pwm: ', channel, `0x${on.toString(16)}`, `0x${off.toString(16)}`)
    this._writeWord(this.registers.LED0_ON_L + 4 * channel, on)
    this._writeWord(this.registers.LED0_OFF_L + 4 * channel, off)
  }

  getPWM (channel) {
    return {
      on: this._readLH(this.registers.LED0_ON_L + 4 * channel),
      off: this._readLH(this.registers.LED0_OFF_L + 4 * channel)
    }
  }

  _stop () {
    this._writeWord(this.registers.ALLLED_OFF_L, 0)
    this._writeWord(this.registers.ALLLED_ON_L, 0)
  }

  setAngle (channel, angle) {
    const count = angle
    this.setPWM(channel, 0, count)
  }

  setCount (channel, count) {
    this.setPWM(channel, 0, count)
  }
}

module.exports = PCA9685BASE
