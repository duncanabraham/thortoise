const rpio = require('rpio')

const directions = {
  in: rpio.INPUT,
  out: rpio.OUTPUT
}
class Pin {
  constructor (options) {
    this.pin = options.pin
    rpio.open(options.pin, directions[options.direction], rpio.LOW) // initialise to LOW
  }

  on () {
    rpio.write(this.pin, rpio.HIGH)
  }

  off () {
    rpio.write(this.pin, rpio.LOW)
  }

  value () {
    return rpio.read(this.pin)
  }
}

module.exports = Pin
