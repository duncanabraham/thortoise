const SC16IS752 = require('./i2c/SC16IS752')
const { delay } = require('./utils')
class StatusLeds extends SC16IS752 {
  constructor (options) {
    super(options)
    this._charging = 0
    this._status = 0
    this._leftEye = 0
    this._rightEye = 0
    this.setAllOut()
    this.eyesOn()
    this.setVoltageLevel(7)
    this.startupSequence()
  }

  async startupSequence (speed = 1000) {
    this.eyesOn()
    let status = 1
    for (let i = 0; i < 8; i++) {
      this.leftBlink()
      this.writeStatusValue(status & this._leftEye)
      status = 1 << i
      await delay(speed)
    }
    for (let i = 7; i > -1; i--) {
      this.leftBlink()
      this.writeStatusValue(status & this._rightEye)
      status = 1 << i
      await delay(speed)
    }
  }

  charging () {
    this._charging = 0x01
  }

  notCharging () {
    this._charging = 0x00
  }

  eyesOn () {
    this._leftEye = 0b01000000
    this._rightEye = 0b10000000
  }

  rightBlink () {
    this._rightEye = 0
    this.writeStatusValue()
    setTimeout(() => {
      this._rightEye = 0b10000000
      this.writeStatusValue()
    }, 500)
  }

  leftBlink () {
    this._leftEye = 0
    this.writeStatusValue()
    setTimeout(() => {
      this._leftEye = 0b01000000
      this.writeStatusValue()
    }, 500)
  }

  writeStatusValue (status) {
    if (status) {
      this.writeByte(status)
    } else {
      this.writeByte(this._status & this._charging & this._leftEye & this._rightEye)
    }
  }

  /**
   * Set the status LEDS
   * @param {number} n the current voltage level of the battery
   */
  setVoltageLevel = (n) => {
    n = (100 / 6.5) * n
    const minVal = 50 // min is 50%
    this._status = 0
    for (let i = 0; i < 5; i++) {
      this._status |= n > minVal + (10 * i) ? 1 << i : 0
    }
    this.writeStatusValue()
  }
}

module.exports = StatusLeds
