require('./common.js')
const LightSensors = require('../lib/lightSensors')
const { delay } = require('../lib/utils')
const lightSensorDefaults = {
  i2cAddress: 0x72
}
const lightSensors = new LightSensors(lightSensorDefaults)

const run = async () => {
  while (true) {
    await delay(1000)
    const values = lightSensors.getValues()
    console.log(values)
  }
}

run()
