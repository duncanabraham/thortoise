const i2c = require('i2c-bus')

const LPS22HB_ADDR = 0x5C
const TEMP_REG = 0x2B

const toCelsius = rawData => {
  rawData = (rawData >> 8) + ((rawData & 0xff) << 8)
  let celsius = (rawData & 0x0fff) / 16
  if (rawData & 0x1000) {
    celsius -= 256
  }
  return celsius
}

const i2c1 = i2c.openSync(1)
const rawData = i2c1.readWordSync(LPS22HB_ADDR, TEMP_REG)
console.log(toCelsius(rawData))
i2c1.closeSync()
