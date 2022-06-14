const i2c = require('i2c-bus')
const { delay } = require('./utils')

/**
 * The MotorDriverHat is a dual motor controller from Waveshare
 * https://www.waveshare.com/wiki/Motor_Driver_HAT
 * Translated from the Python example code provided by Waveshare
 *
 * Usage:
 *
 * driver = new MotorDriver
 * driver.run(0, 'forward', 100) // M0, Full speed forward
 * driver.run(1, 'backward', 50) // M1. Half speed backwards
 * driver.stop(0) // M0, stop!
 *
 * `run` and `stop` are the only public methods required
 *
 */
class MotorDriver {
  constructor (options = { i2cAddress: 0x40 }) {
    this.registers = {
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
    this.PWMA = 0
    this.AIN1 = 1
    this.AIN2 = 2
    this.PWMB = 5
    this.BIN1 = 3
    this.BIN2 = 4
    Object.assign(this, options)
  }

  _init () {
    if (this._openI2C()) {
      this.i2cReader.writeByteSync(this.registers.MODE1, 0)
      this._closeI2C()
    }
  }

  _openI2C () {
    if (!this.i2cOpen) {
      this.i2cOpen = true
      this.i2cReader = i2c.openSync(1)
      return true
    } else {
      return false
    }
  }

  _closeI2C () {
    if (this.i2cOpen) {
      this.i2cReader.closeSync()
      this.i2cOpen = false
    }
  }

  _read (register) {
    if (this.i2cOpen) {
      return this.i2cReader.readByteSync(register)
    }
  }

  _write (register, value) {
    if (this.i2cOpen) {
      this.i2cReader.writeByteSync(register, value)
    }
  }

  _setPWMFreq (freq) {
    let prescale = 25000000.0 // 25MHz
    prescale = prescale / 4096.0 // 12-bit
    prescale = Math.floor((prescale / freq) - 0.5)
    const oldMode = this._read(this.registers.MODE1)
    const newMode = (oldMode & 0x7F) | 0x10
    this._write(this.registers.MODE1, newMode)
    this._write(this.registers.PRESCALE, prescale)
    this._write(this.registers.MODE1, oldMode)
    delay(5)
    this._write(this.registers.MODE1, oldMode | 0x80)
  }

  _setPWM (channel, on, off) {
    this._write(this.registers.LED0_ON_L + 4 * channel, on & 0xFF)
    this._write(this.registers.LED0_ON_H + 4 * channel, 0xff & (on >> 8))
    this._write(this.registers.LED0_OFF_L + 4 * channel, off & 0xFF)
    this._write(this.registers.LED0_OFF_H + 4 * channel, 0xff & (off >> 8))
  }

  _setDutyCycle (channel, pulse) {
    this._setPWM(channel, 0, pulse * parseInt(4096 / 100))
  }

  _setLevel (channel, value) {
    if (value === 1) {
      this._setPWM(channel, 0, 4095)
    } else {
      this._setPWM(channel, 0, 0)
    }
  }

  run (motor, index, speed) {
    if (speed > 100) { speed = 100 }
    if (motor === 0) { // M0
      this.setDutycycle(this.PWMA, speed)
      if (index === 'forward') {
        this._setLevel(this.AIN1, 0)
        this._setLevel(this.AIN2, 1)
      } else {
        this._setLevel(this.AIN1, 1)
        this._setLevel(this.AIN2, 0)
      }
    } else { // M1
      this.setDutycycle(this.PWMB, speed)
      if (index === 'forward') {
        this._setLevel(this.BIN1, 0)
        this._setLevel(this.BIN2, 1)
      } else {
        this._setLevel(this.BIN1, 1)
        this._setLevel(this.BIN2, 0)
      }
    }
  }

  stop (motor) {
    if (motor === 0) {
      this.setDutycycle(this.PWMA, 0)
    } else {
      this.setDutycycle(this.PWMB, 0)
    }
  }
}

module.exports = MotorDriver
