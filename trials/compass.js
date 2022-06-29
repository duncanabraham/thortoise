const Compass = require('../lib/i2c/QMC5883L')

const compass = new Compass({ i2cAddress: 0x0d })
const { delay } = require('../lib/utils')
const { Triplet } = require('../lib/triplet')

const minVals = new Triplet(0, 0, 0)
const maxVals = new Triplet(0, 0, 0)

const fmt = (s, l, d) => {
  s = JSON.stringify(s)
  while (s.length < l) {
    s = d ? ' ' + s : s + ' '
  }
  return s.substring(0, l)
}

const run = async () => {
  while (true) {
    const b = compass.getBearing()
    const raw = compass.raw()
    const adjustedValues = compass.adjustedValues
    minVals.minValues(raw)
    maxVals.maxValues(raw)
    console.log(fmt(b, 5, true), ' : ', fmt(raw, 35, false), ' : ', fmt(compass.smoothed, 35, false), ' : ', fmt(minVals, 35, false), ' : ', fmt(maxVals, 35, false), adjustedValues, '  : ', compass.upsideDown)
    await delay(1000)
  }
}

run()
