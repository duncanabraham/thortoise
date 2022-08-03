require('./common')
const I2c = require('../lib/i2c/i2cBase')
const i2c = new I2c({ i2cAddress: 0x40 })
const delay = require('../lib/utils').delay

const run = async () => {
  i2c._writeByte(0xfe, 0x80) // prescale
  await delay(1)
  i2c._writeByte(0x06, 0x00) // on value = 0

  let pulse = 10
  let direction = 10
  while (true) {
    i2c._writeWord(0x06, 0x00)
    i2c._writeWord(0x08, pulse)
    await delay(10)
    pulse = pulse + direction
    if (pulse > 170 || pulse < 10) {
      direction = -direction
    }
  }
}

run()
