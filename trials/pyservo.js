const I2c = require('../lib/i2c/i2cBase')
const i2c = new I2c({ i2cAddress: 0x40 })
const delay = require('../lib/utils').delay

const run = async () => {
  i2c._writeByte(0xfe, 0x80) // prescale
  await delay(1)
  i2c._writeByte(0x06, 0x00) // on value = 0

  for(let pulse = 10; pulse < 490; pulse += 10) {
    i2c._writeWordLH(0x08, pulse)
    await delay(100)
  }
  i2c._writeWordLH(0x08, 0x00)
}


run()
