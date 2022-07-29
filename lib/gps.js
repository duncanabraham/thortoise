const SerialPort = require('serialport').SerialPort
const SerialPortParser = require('@serialport/parser-readline')
const Gps = require('gps')
const port = new SerialPort({ path: '/dev/ttyAML0', baudRate: 9600 }) // Radxa zero

class GPS extends Gps {
  constructor() {
    super()
    this.parser = port.pipe(new SerialPortParser())

    this.on('data', this.dataHandler.bind(this))
    this.parser.on('data', data => this.update(data))
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
      lat: this.lat,
      lon: this.lon
    }
  }
}

module.exports = GPS
