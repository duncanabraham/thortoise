const TCA9548A = require('./i2c/TCA9548A')
const BH1750FVI = require('./i2c/BH1750FVI')
const INA3221 = require('./i2c/INA3221.js')

const sensorList = [
  { name: 'North', channel: 0, Device: BH1750FVI },
  { name: 'East', channel: 1, Device: BH1750FVI },
  // { name: 'South', channel: 2, Device: BH1750FVI },
  // { name: 'West', channel: 3, Device: BH1750FVI },
  { name: 'VOLTAGES', channel: 4, Device: INA3221 }
]

/**
 * Create an array of (light) sensors that periodically reads the values of all the sensors.
 * At any time I can read the last values by calling getValues()
 */
class SensorMux extends TCA9548A {
  constructor (options = {}) {
    options.type = 'CORE'
    options.group = 'SYSTEM'
    options.i2cAddress = 0x72
    super(options)
    this.sensors = {}
    this.readLoop = setInterval(this._readValues.bind(this), 1000)
    this._init()
  }

  _init () {
    sensorList.forEach((sensorOptions) => {
      this._registerSensors(sensorOptions)
    })
  }

  _readValues () {
    Object.keys(this.sensors).forEach(sensorName => {
      const { device, channel } = this.sensors[sensorName]
      this.switchToChannel(channel)
      this.sensors[sensorName].value = device.readValue()
    })
  }

  _registerSensors (options) {
    this.sensors[options.name] = {
      device: new options.Device(),
      channel: options.channel,
      value: 0
    }
  }

  getValues () {
    return Object.keys(this.sensors).reduce((result, sensorName) => {
      result[sensorName] = this.sensors[sensorName].value
      return result
    }, {})
  }
}

module.exports = SensorMux
