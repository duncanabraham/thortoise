require('./common.js')
const i2c = require('i2c-bus')

const LPS22HB_ADDR = 0x5C
const TEMP_REG = 0x2B

const PressureRegXL = 0x28
const PressureRegL = 0x29
const PressureRegH = 0x2A
const i2cBus = 0x01

const toCelsius = rawData => {
  console.log('rawData: ', rawData, '  First 2 numbers . next 2 numbers ie 2145 = 21.45C')
  rawData = (rawData >> 8) + ((rawData & 0xff) << 8)
  let celsius = (rawData & 0x0fff) / 16
  if (rawData & 0x1000) {
    celsius -= 256
  }
  return celsius
}

const readPressure = (i2c1) => {
  const xl = i2c1.readByteSync(LPS22HB_ADDR, PressureRegXL)
  const l = i2c1.readByteSync(LPS22HB_ADDR, PressureRegL)
  const h = i2c1.readByteSync(LPS22HB_ADDR, PressureRegH)
  const hl = ((h * 65536) + (l * 256) + xl) / 4096

  console.log(`xl: ${xl}, l: ${l}, h: ${h}, hl: ${hl}`)
}

const i2c1 = i2c.openSync(i2cBus)
const rawData = i2c1.readWordSync(LPS22HB_ADDR, TEMP_REG)
readPressure(i2c1)
console.log(toCelsius(rawData))
i2c1.closeSync()
