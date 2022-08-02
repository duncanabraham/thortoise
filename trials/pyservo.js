require('./common')
const I2c = require('../lib/i2c/i2cBase')
const i2c = new I2c({ i2cAddress: 0x40 })
const delay = require('../lib/utils').delay

const run = async () => {
  i2c._writeByte(0xfe, 0x80) // prescale
  await delay(1)
  i2c._writeByte(0x06, 0x00) // on value = 0

  let pulse = 1
  while (true) {
    i2c._writeWordLH(0x06, 0x00)
    i2c._writeWordLH(0x08, pulse)
    await delay(10)
    pulse = pulse + 1
    if (pulse > 500) {
      pulse = 1
    }
  }
}

run()
