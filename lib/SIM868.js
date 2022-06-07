const SerialPort = require('serialport').SerialPort
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
    this.serialPortDevice = '/dev/ttyAMA0'
    this.serialPortSpeed = 9600
    this._data = null
    Object.assign(this, options)
    this.port = new SerialPort({ path: this.serialPortDevice, baudRate: this.serialPortSpeed })
    this.parser = this.port.pipe(parser)
    this.parser.on('data', this._serialRead.bind(this))
  }

  get hasData () {
    return this.data !== null
  }

  get data () {
    const thisData = this._data
    this._data = null
    return thisData
  }

  _serialRead (data) {
    this._data = data
    console.log('received this: ', data)
  }

  _serialWrite (command) {
    this.port.write(command)
    console.log('sending this: ', command)
  }

  status () {
    this._serialWrite(ATCOMMANDS.status)
  }
}

module.exports = SIM868
