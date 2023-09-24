const Gps = require('gps')
const log = require('./log')

let SerialPort
let SerialPortParser
if (process.env.ENVIRONMENT === 'live') {
  log.info('Running in the LIVE Environment')
  SerialPort = require('serialport').SerialPort
  SerialPortParser = require('@serialport/parser-readline')
} else {
  SerialPort = require('./mockserialport')
  SerialPortParser = require('./mockserialportparserreadline')
  log.info('Running in the DEVELOPMENT Environment')
}

class GPS extends Gps {
  constructor (position) {
    super()
    this.position = position
    this.updatedAt = null
    this.port = new SerialPort({ path: '/dev/ttyAML0', baudRate: 9600 }) // Radxa zero
    this.parser = this.port.pipe(new SerialPortParser())

    // when there's data on the gps module, pass it to the data handler
    this.on('data', this.dataHandler.bind(this))

    // when there's data on the serial port, pass it to the gps module
    this.parser.on('data', this.update.bind(this))
  }

  get hasData () {
    return this.position.lon !== -1 && this.position.lat !== -1
  }

  dataHandler (data) {
    if (data.type === 'GGA') {
      if (data.quality != null) {
        this.position.update(data)
        this.updatedAt = new Date().toISOString()
      }
    }
  }

  getValues () {
    return {
      time: new Date().toISOString(),
      updatedAt: this.updatedAt,
      geoPoint: this.position
    }
  }
}

module.exports = GPS
