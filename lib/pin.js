let Gpio
if (process.env.ENVIRONMENT === 'live') {
  Gpio = require('onoff').Gpio
} else {
  console.log('Using mock GPIO on/off')
  Gpio = require('./mockOnOff').Gpio
}

class Pin {
  constructor (options) {
    this.pin = new Gpio(options.pin, options.direction)
  }

  on () {
    this.pin.writeSync(1)
  }

  off () {
    this.pin.writeSync(0)
  }

  value () {
    return this.pin.readSync()
  }
}

module.exports = Pin
