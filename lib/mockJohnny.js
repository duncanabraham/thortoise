/* It's a mock of the Johnny-Five Servo class */
class MockServo {
  constructor (options) {
    Object.assign(this, options)
  }

  stop () { }

  to () { }

  min () { }

  max () { }

  sweep () { }

  home () { }
}

/* It's a mock driver that creates mock servos */
class JohnnyDriver {
  constructor () {
    this.board = {}
  }

  makeServo (options) {
    return new MockServo(options)
  }

  exitHandler (handler) { }

  initBoard () {
    return new Promise(resolve => {
      resolve()
    })
  }
}

module.exports = JohnnyDriver
