const Compass = require('../lib/i2c/QMC5883L')

const compass = new Compass()

console.log(compass.getMagnet())
