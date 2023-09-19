const { delay } = require('../lib/utils')
const LPS22HB = require('../lib/i2c/LPS22HB')
const lps22hb = new LPS22HB({ i2cAddress: 0x5C })


const run = async () => {
  while (true) {
    lps22hb.update()
    const temp = lps22hb.getTemperature()
    const pressure = lps22hb.getPressure()
    await delay(1000)
  }
}

run()
