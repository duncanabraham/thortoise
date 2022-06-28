const Compass = require('../lib/i2c/QMC5883L')

const compass = new Compass({ i2cAddress: 0x0d })
const { delay } = require('../lib/utils')

const run = async () => {
  while (true) {
    await compass.read()
    const a = compass.getAzimuth()
    const b = compass.getBearing(a)

    console.log(b)
    await delay(500)
  }
}

run()
