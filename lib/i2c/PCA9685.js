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
const SERVO_CONSTANT = 2.295

// Returns a number between 71 and 530 which covers the full sweep of the servo
const pulseFromAngle = (angle) =>{
  return Math.floor((angle * SERVO_CONSTANT) + 71)
}

const featureOptions = {
  type: 'OPTIONAL',
  group: 'MOTION',
  resumeHandler: () => { },
  pauseHandler: () => { }
}

/**
 * Through testing I've found that sending a value of 71 to the pwm register will send the servo to the zero position and
 * sending a value of 530 will send the servo to the max position
 *
 * A full sweep of the servo covers 0 to 200 degrees
 */

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
    this._writeWordLH(this.registers.ALLLED_OFF_L, 0)
    this._writeWordLH(this.registers.ALLLED_ON_L, 0)
  }

  /**
   * This works!! the angle is between 0 and 200 and should have been limited between min and max before calling this function
   */
  setAngle (channel, angle) {
    const count = pulseFromAngle(angle)
    this.setPWM(channel, 0, count)
  }

  setCount (channel, count) {
    this.setPWM(channel, 0, count)
  }
}

module.exports = PCA9685BASE
