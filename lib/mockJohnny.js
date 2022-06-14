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

class MockLed {
  constructor (pinId) {
    this.pin = pinId
  }

  stop () { }

  on () { }

  off () { }

  blink () { }
}

/* It's a mock driver that creates mock servos */
class JohnnyDriver {
  constructor () {
    this.rpi = {}
  }

  makeServo (options) {
    return new MockServo(options)
  }

  makeLed (pinId) {
    return new MockLed(pinId)
  }

  exitHandler (handler) { }

  initBoard () {
    return new Promise(resolve => {
      resolve()
    })
  }
}

module.exports = JohnnyDriver
