const Raspi = require('raspi-io').RaspiIO
const { Board, Servo } = require('johnny-five')

/* It creates a board instance and exposes a method to create servos */
class JohnnyDriver {
  constructor () {
    this.board = new Board({
      io: new Raspi()
    })
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
