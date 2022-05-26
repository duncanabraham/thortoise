class MockServo {
  constructor(options) {
    Object.assign(this, options)
  }

  stop() { }

  to() { }

  min() { }

  max() { }

  sweep() { }

  home() { }
}

class JohnnyDriver {
  constructor() {
    this.board = {}
  }

  makeServo(options) {
    return new MockServo(options)
  }

  exitHandler(handler) { }

  initBoard() {
    return new Promise(resolve => {
      resolve()
    })
  }
}

module.exports = JohnnyDriver
