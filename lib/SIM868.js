const { SerialPort } = require('serialport')
const SerialPortParser = require('@serialport/parser-readline')
const SerialPortParserReadlineParser = require('@serialport/parser-readline').ReadlineParser
const { ATCOMMANDS } = require('../config')

let parser
/**
 * Workaround for different implementations of the SerialPortParser
 */
try {
  parser = new SerialPortParser()
} catch (e) {
  parser = new SerialPortParserReadlineParser()
}

class SIM868 {
  constructor (options = {}) {
    this.serialPortDevice = '/dev/serial1'
    this.serialPortSpeed = 115200
    this._data = null
    Object.assign(this, options)
    this.port = new SerialPort({ path: this.serialPortDevice, baudRate: this.serialPortSpeed })
    this.init()
    this.parser = this.port.pipe(parser)
    this.parser.on('data', this._serialRead.bind(this))
  }

  async init() {
    console.log('list: ', await SerialPort.list())
  }

  hasData () {
    return this.data !== null
  }

  getData () {
    const thisData = this._data
    this._data = null
    return thisData
  }

  _serialRead (data) {
    this._data = data
    console.log('received this: ', data)
  }

  _serialWrite (command) {
    this.port.write(command, (err) => {
      console.error(err)
    })
    console.log('sending this: ', command)
  }

  status () {
    this._serialWrite(ATCOMMANDS.status)
  }
}

module.exports = SIM868
