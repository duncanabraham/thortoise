const LightSensors = require('../lib/lightSensors')
const { delay } = require('../lib/utils')
const lightSensors = new LightSensors()

const run = async () => {
  while (true) {
    await delay(1000)
    const values = lightSensors.getValues()
    console.log(values)
  }
}

run()
