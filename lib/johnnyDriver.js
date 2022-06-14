const Raspi = require('raspi-io').RaspiIO
const { Board, Servo, Led } = require('johnny-five')

/* It creates a board instance and exposes a method to create servos */
class JohnnyDriver {
  constructor () {
    this.rpi = new Board({ io: new Raspi() })
    // this.gpsSerial = new Board({ port: '/dev/ttySC1' })
  }

  /**
   * Servo Factory
   * @param {Object} options must include a unique id
   * @returns a servo instance
   */
  makeServo (options) {
    return new Servo(options)
  }

  /**
   * Return a Johnny-Five Led control
   * Leds have methods: on, off, blink and stop
   * @param {integer} pinId
   * @returns Led instance
   */
  makeLed (pinId) {
    return new Led(pinId)
  }

  /**
   * It takes a function as an argument and assigns it to the board's exit event
   * @param handler - A function that will be called when the board exits.
   */
  exitHandler (handler) {
    this.rpi.on('exit', handler)
  }

  async initBoard () {
    return new Promise(resolve => {
      this.rpi.on('ready', resolve)
    })
  }
}

module.exports = JohnnyDriver
