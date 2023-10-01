const log = require('../log')
const { i2cSettings } = require('../../config')
const Feature = require('../feature')
let i2c
if (process.env.ENVIRONMENT === 'live') {
  log.info('Running in the LIVE Environment')
  i2c = require('i2c-bus')
} else {
  i2c = require('./mock-i2c-bus')
  log.info('Running in the DEVELOPMENT Environment')
}

const featureOptions = {
  type: 'OPTIONAL',
  group: 'SENSOR',
  resumeHandler: () => { },
  pauseHandler: () => { }
}

class I2cBase extends Feature {
  constructor (options = {}, additional = {}) {
    super({ ...featureOptions, ...additional, ...options })
    if (!('i2cAddress' in options)) {
      log.error('You must pass an i2c address to an i2c device constructor', options)
      process.exit(0)
    }
    this.i2cOpen = false
    this.active = this.deviceExists()
  }

  async deviceExists () {
    if (this._openI2C()) {
      const deviceIds = this.i2c.scanSync(this.i2cAddress)
      console.log('All Devices: ', deviceIds)
      this._closeI2C()
    }
  }

  /**
   * Write a byte to a register
   * @param {BYTE} register - The register to write to.
   * @param {BYTE} value - The value to write to the register
   */
  _writeByte (register, value, debug = '') {
    if (this._openI2C()) {
      try {
        this.i2c.writeByteSync(this.i2cAddress, register, value)
      } catch (e) {
        log.info('register: ', register, '    value: ', value, '    debug: ', debug)
        log.error(e)
      }
      this._closeI2C()
    } else {
      throw new Error('i2c not open')
    }
  }

  _writeWord (register, value) {
    if (this._openI2C()) {
      try {
        this.i2c.writeWordSync(this.i2cAddress, register, value)
      } catch (e) {
        log.info('register: ', register, '    value: ', value)
        log.error(e)
      }
      this._closeI2C()
    } else {
      throw new Error('i2c not open')
    }
  }

  _writeWordLH (register, value) {
    if (this._openI2C()) {
      try {
        // swap bytes hl -> lh
        const lh = ((value & 0xFF) << 8) | ((value >> 8) & 0xFF)
        return this.i2c.writeWordSync(this.i2cAddress, register, lh)
      } catch (e) {
        log.info('register: ', register, '    value: ', value)
        log.error(e)
      }
      this._closeI2C()
    }
  }

  /**
   * It reads a byte from the I2C device.
   * @param {BYTE} register - The register to read from
   * @returns {BYTE} The value of the register.
   */
  _readByte (register) {
    let value
    if (this._openI2C()) {
      try {
        value = this.i2c.readByteSync(this.i2cAddress, register)
      } catch (e) {
        log.info('register: ', register, '    value: ', value)
        log.error(e)
        value = 0
      }
      this._closeI2C()
      return value
    } else {
      throw new Error('i2c not open')
    }
  }

  _readWord (register) {
    let value
    if (this._openI2C()) {
      try {
        value = this.i2c.readWordSync(this.i2cAddress, register)
      } catch (e) {
        log.info('register: ', register, '    value: ', value)
        log.error(e)
        value = 0
      }
      this._closeI2C()
      return value
    } else {
      throw new Error('i2c not open')
    }
  }

  _readWordLH (register) {
    const result = this._readWord(register)
    const lowbyte = (result & 0xFF00) >> 8
    const highbyte = (result & 0x00FF) << 8
    return lowbyte + highbyte
  }

  /**
   * If the i2cOpen variable is false, then open the i2c bus and set the i2cOpen variable to true
   * @returns A boolean value.
   */
  _openI2C () {
    if (!this.i2cOpen) {
      this.i2cOpen = true
      this.i2c = i2c.openSync(i2cSettings.i2cBus)
      return true
    } else {
      return false
    }
  }

  /**
   * Close the i2c connection
   */
  _closeI2C () {
    if (this.i2cOpen) {
      this.i2c.closeSync()
      this.i2cOpen = false
    }
  }

  /**
   * Convert a word to a signed int
   * @param {WORD} value the number to convert to a signed int
   * @returns signed int
   */
  _twosComp (value) {
    if (value & 0x800000) {
      // Perform 2's complement for negative values
      value = -(0x1000000 - value)
    }
    return value
  }

  /**
   * Read 2 consecutive bytes with the first being the lower 8 bits of a word and the second the upper 8
   * @param {BYTE} register Where to read from
   * @returns {WORD} the value from the register(s)
   */
  _readLH (register) {
    if (this._openI2C()) {
      const l = this.i2c.readByteSync(this.i2cAddress, register)
      const h = this.i2c.readByteSync(this.i2cAddress, register + 1)
      this._closeI2C()
      return (h * 256) + l
    }
  }

  /**
   * Read 2 consecutive bytes with the first being the upper 8 bits of a word and the second the lower 8
   * @param {BYTE} register Where to read from
   * @returns {WORD} the value from the register(s)
   */
  _readHL (register) {
    if (this._openI2C()) {
      const h = this.i2c.readByteSync(this.i2cAddress, register)
      const l = this.i2c.readByteSync(this.i2cAddress, register + 1)
      this._closeI2C()
      return (h * 256) + l
    } else {
      throw new Error('i2c not open')
    }
  }

  fromTwosComplement (twosComplement, numberBytes) {
    const numberBits = (numberBytes || 1) * 8
    if (twosComplement < 0 || twosComplement > (1 << numberBits) - 1) {
      throw new Error(`Two's complement out of range given ${numberBytes} byte(s) to represent.`)
    }
    if (twosComplement <= Math.pow(2, numberBits - 1) - 1) {
      return twosComplement
    }
    return -(((~twosComplement) & ((1 << numberBits) - 1)) + 1)
  }

  /**
   * Read a register where the value is stored in 2's complement
   * @param {BYTE} register which register to read
   * @param {BOOLEAN} LSB read HL or LH
   * @returns {WORD}
   */
  _readWord2c (register, LSB = false) {
    const val = LSB ? this._readLH(register) : this._readHL(register)
    return this.fromTwosComplement(val, 2)
  }
}

module.exports = I2cBase
