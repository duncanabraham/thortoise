const Compass = require('../lib/i2c/QMC5883L')

const compass = new Compass({ i2cAddress: 0x0d })
const { delay } = require('../lib/utils')

const run = async () => {
  while (true) {
    const b = compass.getBearing()
    const raw = compass.raw()
    const temperature = compass.getTemperature()
    console.log(b, ' : ', raw, ' : ', temperature)
    await delay(1000)
  }
}

run()
