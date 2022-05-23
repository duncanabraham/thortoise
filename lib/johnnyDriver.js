const Raspi = require('raspi-io').RaspiIO
const { Board, Servo } = require('johnny-five')

class JohnnyDriver {
  constructor () {
    this.board = new Board({
      io: new Raspi()
    })
    this.controller = 'PCA9685'
  }

  /**
   * Servo Factory
   * @param {Object} options must include a unique id
   * @returns a servo instance
   */
  makeServo (options) {
    return new Servo({ controller: this.controller, ...options })
  }

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
