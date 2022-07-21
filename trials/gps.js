require('./common.js')
const SerialPort = require('serialport').SerialPort
const SerialPortParser = require('@serialport/parser-readline')
const GPS = require('gps')

const port = new SerialPort({ path: '/dev/ttySC1', baudRate: 9600 })
const gps = new GPS()

const parser = port.pipe(new SerialPortParser())

gps.on('data', async data => { // when we get sent data from the port monitor, output our location
  if (data.type === 'GGA') {
    if (data.quality != null) {
      console.log(`you're at: ${data.lat}, ${data.lon}`)
    } else {
      console.log('no gps fix available')
    }
  }
})

parser.on('data', data => { // when we see data on the serial port, pass it to the gps module
  gps.update(data)
})

console.log('waiting for data ...')
