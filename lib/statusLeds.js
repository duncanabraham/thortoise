const SC16IS752 = require('./i2c/SC16IS752')

class StatusLeds extends SC16IS752 {
  constructor (options) {
    super(options)
    this._powerOnStatus = 0
    this._status = 0
    this._leftEye = 0
    this._rightEye = 0
    this.setAllOut()
    this.eyesOn()
    this.setVoltageLevel(7)
  }

  powerOn () {
    this._powerOnStatus = 0x01
  }

  powerOff () {
    this._powerOnStatus = 0x00
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

  writeStatusValue () {
    this.writeByte(this._status & this._powerOnStatus & this._leftEye & this._rightEye)
  }

  /**
   * Set the status LEDS
   * @param {number} n the current voltage level of the battery
   */
  setVoltageLevel (n) {
    n = (6.5 / 100) * n
    if (n > 50) { // if the battery is at 50% we're in trouble!!
      this._status &= 0b00000010 // red
    }
    if (n > 60) {
      this._status &= 0b00000100 // amber
    }
    if (n > 70) {
      this._status &= 0b00001000 // green
    }
    if (n > 80) {
      this._status &= 0b00010000 // green
    }
    if (n > 90) {
      this._status &= 0b00100000 // green
    }
    this.writeStatusValue()
  }
}

module.exports = StatusLeds
