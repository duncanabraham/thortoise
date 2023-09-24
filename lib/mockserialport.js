class MockSerialPort {
  constructor (config) {
    Object.assign(this, config)
  }

  pipe (parser) {
    return parser
  }
}

module.exports = MockSerialPort
