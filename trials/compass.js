const Compass = require('../lib/i2c/QMC5883L')

const compass = new Compass({ i2cAddress: 0x0d })
const { delay } = require('../lib/utils')
const { Triplet } = require('../lib/triplet')

const minVals = new Triplet(0, 0, 0)
const maxVals = new Triplet(0, 0, 0)

const fmt = (s, l, d) => {
  while (s.length < l) {
    s = d ? ' ' + s : s + ' '
  }
  return s.substring(0, l)
}

const run = async () => {
  while (true) {
    const b = compass.getBearing()
    const raw = compass.raw()
    const temperature = compass.getTemperature()
    minVals.minValues(raw)
    maxVals.maxValues(raw)
    console.log(fmt(b, 5, true), ' : ', fmt(raw, 15, false), ' : ', fmt(temperature, 8, false), ' : ', fmt(minVals, 15, false), ' : ', fmt(maxVals, 15, false))
    await delay(1000)
  }
}

run()
