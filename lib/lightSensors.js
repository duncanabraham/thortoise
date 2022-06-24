const TCA9548A = require('./i2c/TCA9548A')
const BH1750FVI = require('./i2c/BH1750FVI')

const sensorList = [
  { name: 'North', channel: 0, Device: BH1750FVI },
  { name: 'East', channel: 1, Device: BH1750FVI },
  { name: 'South', channel: 2, Device: BH1750FVI },
  { name: 'West', channel: 3, Device: BH1750FVI },
  { name: 'Down', channel: 4, Device: BH1750FVI }
]

/**
 * Create an array of lightsensors that periodically reads the values of all the sensors.
 * At any time I can read the values which were last set by calling getValues()
 */
class LightSensorArray extends TCA9548A {
  constructor (options) {
    super(options)
    this.sensors = {}
    this.readLoop = setInterval(this._readValues.bind(this), 1000)
  }

  _init () {
    sensorList.forEach((sensorOptions) => {
      this._registerSensor(sensorOptions)
    })
  }

  _readValues () {
    Object.keys(this.sensors).forEach(sensorName => {
      this.sensors[sensorName].value = this.sensors[sensorName].device.readValue()
    })
  }

  _registerSensor (options) {
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

module.exports = LightSensorArray