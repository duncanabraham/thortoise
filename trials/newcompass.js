require('./common')
const { delay } = require('../lib/utils')
const Compass = require('../lib/i2c/QMC5883L')
const compass = new Compass()

const run = async () => {
  while (true) {
    compass.read()
    console.log('heading: ', compass.heading, '  temperature: ', compass.temperature)
    await delay(1000)
  }
}

run()
