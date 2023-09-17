const i2cDevice = require('./i2cBase')
/**
 * The SC16IS752/SC16IS762 is an I2C-bus/SPI bus interface to a dual-channel high
 * performance UART offering data rates up to 5 Mbit/s, low operating and sleeping current;
 * it also provides the application with 8 additional programmable I/O pins.
 *
 * The module provides access to the 8 programmable I/O pins
 */
class SC16IS752 extends i2cDevice {
  constructor (options = { i2cAddress: 0x48, bus: 3 }, additional = {}) {
    options.group = 'HAT'
    options.type = 'CORE' // status indicators
    super(options, additional)
    this.ioDir = 0x0A
    this.ioState = 0x0B
    this.dirMask = 0x00
    this.writeByte(this.dirMask)
  }

  setIn (bit) {
    const setBit = Math.pow(2, bit)
    this.dirMask = this.dirMask & setBit
      ? this.dirMask - setBit
      : this.dirMask
    this._writeByte(this.ioDir, this.dirMask)
  }

  setAllIn () {
    this.dirMask = 0
    this._writeByte(this.ioDir, this.dirMask)
  }

  setOut (bit) {
    const setBit = Math.pow(2, bit)
    this.dirMask = !(this.dirMask & setBit)
      ? this.dirMask + setBit
      : this.dirMask
    this._writeByte(this.ioDir, this.dirMask)
  }

  setAllOut () {
    this.dirMask = 255
    this._writeByte(this.ioDir, this.dirMask)
  }

  getBit (bit) {
    const value = this.readByte()
    const setBit = Math.pow(2, bit)
    return (value & setBit) === setBit
  }

  setBit (bit) {
    const setValue = Math.pow(2, bit)
    const value = this.readByte()
    this._writeByte(this.ioState, value | setValue & this.dirMask)
  }

  unsetBit (bit) {
    const setBit = Math.pow(2, bit)
    const value = this.readByte()
    const setValue = value & setBit === value ? value - setBit : value
    this._writeByte(this.ioState, setValue)
  }

  writeByte (value) {
    this.dirMask = value
    this._writeByte(this.ioDir, this.dirMask)
  }

  readByte () {
    return this._readHL(this.ioState)
  }
}

module.exports = SC16IS752
