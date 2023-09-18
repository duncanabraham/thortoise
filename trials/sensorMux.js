require('./common')
const SensorMux = require('../lib/sensorMux')
const { delay } = require('../lib/utils')
const sensorArray = new SensorMux({ i2cAddress: 0x77 })

sensorArray.init()

const run = async () => {
  while (true) {
    const values = sensorArray.getValues()
    console.log('sensors: ', values)
    await delay(1000)
  }
}

run()
