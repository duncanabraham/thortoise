class MockServo {
  constructor(options) {
    Object.assign(this, options)
    this.stopCount = 0
    this.toValue = 0
  }

  stop() {
    this.stopCount++
  }

  to(pos) {
    this.toValue = pos
  }
}

class JohnnyDriver {
  constructor() {
    this.board = {}
  }

  /**
   * Servo Factory
   * @param {Object} options must include a unique id
   * @returns a servo instance
   */
  makeServo(options) {
    return new MockServo(options)
  }

  exitHandler(handler) {}

  async initBoard() {}
}

module.exports = JohnnyDriver
