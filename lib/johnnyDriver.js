const Raspi = require('raspi-io').RaspiIO
const { Board, Servo, Led } = require('johnny-five')

/* It creates a board instance and exposes a method to create servos */
class JohnnyDriver {
  constructor () {
    this.board = new Board({
      io: new Raspi()
    })
    console.log('board: ', this.board.io)
  }

  gpsChangeHandler () {
    console.log('position')
    console.log('  latitude   : ', this.gps.latitude)
    console.log('  longitude  : ', this.gps.longitude)
    console.log('  altitude   : ', this.gps.altitude)
    console.log('--------------------------------------')
  }

  gpsNavigationHandler () {
    console.log('navigation')
    console.log('  speed   : ', this.gps.speed)
    console.log('  course  : ', this.gps.course)
    console.log('--------------------------------------')
  }

  initGPS () {
    this.gps.on('change', this.gpsChangeHandler.bind(this))
    this.gps.on('navigation', this.gpsNavigationHandler.bind(this))
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
    this.board.on('exit', handler)
  }

  async initBoard () {
    return new Promise(resolve => {
      this.board.on('ready', resolve)
    })
  }
}

module.exports = JohnnyDriver
