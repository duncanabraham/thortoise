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
  const direction = {
    0: 'START',
    1: 'N',
    2: 'E',
    3: 'NE',
    4: 'S',
    5: 'ERROR',
    6: 'SE',
    7: 'ERROR',
    8: 'W',
    9: 'NW',
    10: 'ERROR',
    11: 'ERROR',
    12: 'SW',
    13: 'ERROR',
    14: 'ERROR',
    15: 'ERROR'
  }
  while (true) {
    const raw = compass.raw()
    const avg = compass.smoothed.avg()
    const head = compass.getHeading()
    const cal = compass.getCalibration()
    const temp = compass.getTemperature()
    console.log(fmt(direction[compass._heading], 6, true), ' : ', fmt(compass._heading, 5, true), ' : ', fmt(head, 5, true), ' : ', fmt(raw, 35, false), ' : ', fmt(avg, 35, false), ' : ', fmt(cal.calibrationMin, 35, false), ' : ', fmt(cal.calibrationMax, 35, false), ' : ', fmt(temp, 35, false))
    await delay(1000)
  }
}

run()
