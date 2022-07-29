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
    this._writeByte(this.registers.MODE1, 0x00)
    this._setPWMFreq(50) // 50Hz for Servos
  }

  async _allOff() {
    await this._writeByte(this.registers.ALLLED_OFF_L, 0x00)
    await this._writeByte(this.registers.ALLLED_OFF_H, 0x10)
  }

  async _setPWMFreq (freq) {
    const prescale = Math.floor(25000000 / 4096 / freq + 0.5) // 25MHz / 50Hz
    this.frequency = freq
    const oldMode = await this._readByte(this.registers.MODE1)
    const newMode = (oldMode & 0x7F) | 0x10
    await this._writeByte(this.registers.MODE1, newMode)
    await this._writeByte(this.registers.PRESCALE, prescale)
    await this._writeByte(this.registers.MODE1, oldMode)
    delay(1)
    await this._writeByte(this.registers.MODE1, oldMode | 0x80) // Mode 1, restart
  }

  /**
   * The turn-on time of each LED driver output and the duty cycle of PWM can be controlled
   * independently using the LEDn_ON and LEDn_OFF registers.
   *
   * There will be two 12-bit registers per LED output. These registers will be programmed by
   * the user. Both registers will hold a value from 0 to 4095. One 12-bit register will hold a
   * value for the ON time and the other 12-bit register will hold the value for the OFF time. The
   * ON and OFF times are compared with the value of a 12-bit counter that will be running
   * continuously from 0000h to 0FFFh (0 to 4095 decimal).
   *
   * @param {*} channel
   * @param {*} on
   * @param {*} off
   */
  async _setPWM (channel, on = 0, off = 4095) {
    const onL = on & 0xFF
    const onH = on >> 8
    const offL = off & 0xFF
    const offH = off >> 8
    console.log('writing: ', onL, onH, offL, offH)
    await this._writeByte(this.registers.LED0_ON_L + 4 * channel, onL)
    await this._writeByte(this.registers.LED0_ON_H + 4 * channel, onH)
    await this._writeByte(this.registers.LED0_OFF_L + 4 * channel, offL)
    await this._writeByte(this.registers.LED0_OFF_H + 4 * channel, offH)
  }

  async _setServoPulse (channel, pulse) {
    pulse = pulse / (Math.floor(1000000 / this.frequency / 4096))
    await this._setPWM(channel, 0, pulse)
  }

  async setServoPercent (channel, percent) {
    const offTime = Math.floor(percent * 4096 / 100)
    await this._setPWM(channel, 0, offTime)
  }
}

module.exports = PCA9685BASE