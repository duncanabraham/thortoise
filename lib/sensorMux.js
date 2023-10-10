const TCA9548A = require('./i2c/TCA9548A')
const BH1750FVI = require('./i2c/BH1750FVI')
// const INA3221 = require('./i2c/INA3221.js') // TODO: conenct i2c through the Thortoise shell

const sensorList = [
  { name: 'North', channel: 0, Device: BH1750FVI },
  { name: 'East', channel: 1, Device: BH1750FVI },
  { name: 'South', channel: 2, Device: BH1750FVI },
  { name: 'West', channel: 3, Device: BH1750FVI }
  // { name: 'VOLTAGES', channel: 4, Device: INA3221 }
]

/**
 * Create an array of (light) sensors that periodically reads the values of all the sensors.
 * At any time I can read the last values by calling getValues()
 */
class SensorMux extends TCA9548A {
  constructor (options = { i2cAddress: 0x77 }) {
    options.type = 'CORE'
    options.group = 'SYSTEM'
    super(options)
    this.sensors = {}
    this.readLoop = setInterval(this._readValues.bind(this), 1000)
    this.init()
  }

  init () {
    sensorList.forEach((sensorOptions) => {
      this._registerSensors(sensorOptions)
    })
  }

  _readValues () {
    Object.keys(this.sensors).forEach(async sensorName => {
      const { device, channel } = this.sensors[sensorName]
      this.switchToChannel(channel)
      this.sensors[sensorName].value = await device.readValue() // every device must have a readValue() method
    })
  }

  _registerSensors (sensor) {
    this.sensors[sensor.name] = {
      device: new sensor.Device(),
      channel: sensor.channel,
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
