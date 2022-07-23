require('./common.js')
const SensorMux = require('../lib/sensorMux')
const { delay } = require('../lib/utils')
const sensorMuxDefaults = {
  i2cAddress: 0x72
}
const sensorArray = new SensorMux(sensorMuxDefaults)

const run = async () => {
  while (true) {
    await delay(1000)
    const values = sensorArray.getValues()
    console.log(values)
  }
}

run()
