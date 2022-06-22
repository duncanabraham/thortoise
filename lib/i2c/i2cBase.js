const i2c = require('i2c-bus')

class I2cBase {
  constructor (options = { }, additional = {}) {
    if (!('i2cAddress' in options)) {
      console.error('You must pass an i2c address to an i2c device constructor')
      process.exit(0)
    }
    Object.assign(this, options, additional)
  }

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

  _readLH (register) {
    if (this._openI2C()) {
      const l = this.i2cReader.readByteSync(this.i2cAddress, register)
      const h = this.i2cReader.readByteSync(this.i2cAddress, register + 1)
      this._closeI2C()
      return h * 256 + l
    }
  }

  _readHL (register) {
    if (this._openI2C()) {
      const h = this.i2cReader.readByteSync(this.i2cAddress, register)
      const l = this.i2cReader.readByteSync(this.i2cAddress, register + 1)
      this._closeI2C()
      return h * 256 + l
    }
  }

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
