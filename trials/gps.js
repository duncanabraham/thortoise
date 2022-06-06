const SerialPort = require('serialport').SerialPort
const SerialPortParser = require('@serialport/parser-readline')
const GPS = require('gps')

const port = new SerialPort('/dev/ttyAMA0', { baudRate: 9600 })
const gps = new GPS()

const parser = port.pipe(new SerialPortParser())

gps.on('data', async data => {
  if(data.type == 'GGA') {
      if(data.quality != null) {
          let address = await getAddressInformation(data.lat, data.lon)
          console.log(address.Label + ' [' + data.lat + ', ' + data.lon + ']')
      } else {
          console.log('no gps fix available')
      }
  }
})

parser.on('data', data => {
  try {
      gps.update(data)
  } catch (e) {
      throw e
  }
})