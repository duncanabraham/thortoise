const SerialPort = require('serialport').SerialPort
const SerialPortParser = require('@serialport/parser-readline')
const Gps = require('gps')

class GPS extends Gps {
  constructor() {
    super()
    this.port = new SerialPort({ path: '/dev/ttyAML0', baudRate: 9600 }) // Radxa zero
    this.parser = this.port.pipe(new SerialPortParser())

    // when there's data on the gps module, pass it to the data handler
    this.on('data', this.dataHandler.bind(this))

    // when there's data on the serial port, pass it to the gps module
    this.parser.on('data', this.update.bind(this))
  }

  dataHandler(data) {
    if (data.type === 'GGA') {
      if (data.quality != null) {
        console.log(`you're at: ${data.lat}, ${data.lon}`)
        this.lat = data.lat
        this.lon = data.lon
      } else {
        console.log('no gps fix available')
      }
    }
  }

  getGeoPoint() {
    return {
      lat: this.lat || 0,
      lon: this.lon || 0
    }
  }
}

module.exports = GPS
