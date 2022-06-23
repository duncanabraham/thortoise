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
    this.devices = new Array(8)
  }

  write (channel, register, value) {

  }

  read (channel, register) {
    const port = 1 << channel
    return this._readByte(port)
  }

  registerDevice (channel, Device, options) {
    if (!this.devices[channel]) {
      this.devices[channel] = new Device(options)
      return true
    } else {
      return false
    }
  }

  unregisterDevice (channel) {
    if (this.devices[channel]) {
      this.devices[channel] = null
      return true
    } else {
      return false
    }
  }
}

module.exports = TCA9548A
