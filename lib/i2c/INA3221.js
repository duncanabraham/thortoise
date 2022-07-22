const i2cBase = require('./i2cBase')
const registers = require('./INA3221_Registers')

class INA3221 extends i2cBase {
  constructor (options = { i2cAddress: 0x40 }) {
    super({ ...options, group: 'SENSOR' }, registers)
    this.channelNames = ['SOLAR', 'THORTOISE', 'BATTERY']
    this._init()
    this.value = {}
  }

  _init () {
    this.config = this.INA3221_CONFIG_ENABLE_CHAN1 |
      this.INA3221_CONFIG_ENABLE_CHAN2 |
      this.INA3221_CONFIG_ENABLE_CHAN3 |
      this.INA3221_CONFIG_AVG1 |
      this.INA3221_CONFIG_VBUS_CT2 |
      this.INA3221_CONFIG_VSH_CT2 |
      this.INA3221_CONFIG_MODE_2 |
      this.INA3221_CONFIG_MODE_1 |
      this.INA3221_CONFIG_MODE_0
    this._writeWordLH(this.i2cAddress, this.INA3221_REG_CONFIG, this.config)
  }

  getBusVoltageRaw (channel) {
    let value = this._readWordLH(this.INA3221_REG_BUSVOLTAGE_1 + (channel - 1) * 2)
    if (value > 32767) {
      value -= 65536
    }
    return value
  }

  getShuntVoltageRaw (channel) {
    let value = this._readWordLH(this.INA3221_REG_SHUNTVOLTAGE_1 + (channel - 1) * 2)
    if (value > 32767) {
      value -= 65536
    }
    return value
  }

  getBusVoltage (channel) {
    const value = this.getBusVoltageRaw(channel)
    return value * 0.001
  }

  getShuntVoltage (channel) {
    const value = this.getShuntVoltageRaw(channel)
    return value * 0.005
  }

  getCurrent (channel) {
    const valueDec = this.getShuntVoltageRaw(channel) / this.SHUNT_RESISTOR_VALUE
    return valueDec
  }

  readValue () {
    const result = {}
    ;[1, 2, 3].forEach(channel => {
      const channelResult = {
        busVoltage: this.getBusVoltage(channel),
        shuntVoltage: this.getShuntVoltage(channel),
        current: this.getCurrent(channel)
      }
      result[this.channelNames[channel]] = channelResult
    })
    this.value = result
    return result
  }
}

module.exports = INA3221
