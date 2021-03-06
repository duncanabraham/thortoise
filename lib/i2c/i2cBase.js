const Feature = require('../feature')
let i2c
try {
  i2c = require('i2c-bus')
} catch (e) {
  i2c = require('./mock-i2c-bus')
}

const i2cBus = 0x03

const featureOptions = {
  type: 'OPTIONAL',
  group: 'SENSOR',
  resumeHandler: () => { },
  pauseHandler: () => { }
}
class I2cBase extends Feature {
  constructor (options = {}, additional = {}) {
    super({ ...featureOptions, ...options })
    if (!('i2cAddress' in options)) {
      console.error('You must pass an i2c address to an i2c device constructor', options)
      process.exit(0)
    }
    Object.assign(this, additional)
  }

  /**
   * Write a byte to a register
   * @param {BYTE} register - The register to write to.
   * @param {BYTE} value - The value to write to the register
   */
  _writeByte (register, value) {
    if (this._openI2C()) {
      try {
        this.i2cReader.writeByteSync(this.i2cAddress, register, value)
      } catch (e) {
        console.log('register: ', register, '    value: ', value)
        console.error(e)
      }
      this._closeI2C()
    }
  }

  _writeWord (register, value) {
    if (this._openI2C()) {
      try {
        this.i2cReader.writeWordSync(this.i2cAddress, register, value)
      } catch (e) {
        console.log('register: ', register, '    value: ', value)
        console.error(e)
      }
      this._closeI2C()
    }
  }

  _writeWordLH (register, value) {
    if (this._openI2C()) {
      try {
        const lowbyte = (value & 0xFF00) >> 8
        const highbyte = (value & 0x00FF) << 8
        const lh = lowbyte + highbyte
        this.i2cReader.writeWordSync(this.i2cAddress, register, lh)
      } catch (e) {
        console.log('register: ', register, '    value: ', value)
        console.error(e)
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
        value = this.i2cReader.readByteSync(this.i2cAddress, register)
      } catch (e) {
        console.log('register: ', register, '    value: ', value)
        console.error(e)
        value = 0
      }
      this._closeI2C()
      return value
    }
  }

  _readWord (register) {
    let value
    if (this._openI2C()) {
      try {
        value = this.i2cReader.readWordSync(this.i2cAddress, register)
      } catch (e) {
        console.log('register: ', register, '    value: ', value)
        console.error(e)
        value = 0
      }
      this._closeI2C()
      return value
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
      this.i2cReader = i2c.openSync(i2cBus)
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
      this.i2cReader.closeSync()
      this.i2cOpen = false
    }
  }

  /**
   * Read 2 consecutive bytes with the first being the lower 8 bits of a word and the second the upper 8
   * @param {BYTE} register Where to read from
   * @returns {WORD} the value from the register(s)
   */
  _readLH (register) {
    if (this._openI2C()) {
      const l = this.i2cReader.readByteSync(this.i2cAddress, register)
      const h = this.i2cReader.readByteSync(this.i2cAddress, register + 1)
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
      const h = this.i2cReader.readByteSync(this.i2cAddress, register)
      const l = this.i2cReader.readByteSync(this.i2cAddress, register + 1)
      this._closeI2C()
      return (h * 256) + l
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

  /**
   * Convert a word to a signed int
   * @param {WORD} n the number to convert to a signed int
   * @returns signed int
   */
  _toSignedInt (n) {
    if (n > 32667) {
      n = n - 65535
    }
    if (n < -32766) {
      n = n + 65535
    }
    return n
  }
}

module.exports = I2cBase
