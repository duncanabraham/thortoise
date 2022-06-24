const i2cBase = require('./i2cBase')

const registers = {
  COMMAND_BYTE: 0x01
}

const defaults = {
  i2cAddress: 0x70
}

class TCA9548A extends i2cBase {
  constructor (options = defaults) {
    super(options, registers)
    this._init()
  }

  _init () {

  }

  write (channel, register, value) {

  }

  read (channel, register) {
    const port = 1 << channel
    return this._readByte(port)
  }
}

module.exports = TCA9548A
