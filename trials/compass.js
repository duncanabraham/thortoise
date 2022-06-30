const Compass = require('../lib/i2c/QMC5883L')

const compass = new Compass({ i2cAddress: 0x0d })
const { delay } = require('../lib/utils')

const fmt = (s, l, d) => {
  s = JSON.stringify(s)
  while (s.length < l) {
    s = d ? ' ' + s : s + ' '
  }
  return s.substring(0, l)
}

const run = async () => {
  while (true) {
    const raw = compass.raw()
    const avg = compass.smoothed.avg()
    const head = compass.getHeading()
    const cal = compass.getCalibration()
    console.log(fmt(head, 5, true), ' : ', fmt(raw, 35, false), ' : ', fmt(avg, 35, false), ' : ', fmt(cal.calibrationMin, 35, false), ' : ', fmt(cal.calibrationMax, 35, false))
    await delay(1000)
  }
}

run()
