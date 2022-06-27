const Compass = require('../lib/i2c/QMC5883L')

const compass = new Compass({ i2cAddress: 0x0d })
const { delay } = require('../lib/utils')

const run = async () => {
  while (true) {
    console.log(compass.getMagnet())
    await delay(500)
  }
}


run()
