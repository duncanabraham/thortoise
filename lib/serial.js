const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline') // For parsing incoming data

class Serial {
  constructor (uartId, baudRate) {
    this.databuffer = ''
    this.port = new SerialPort(uartId, {
      baudRate // Set the baud rate to match your device
    })
    this.portOpen = false

    this.parser = this.port.pipe(new Readline({ delimiter: '\r\n' })) // Create a parser to handle incoming data

    this.port.on('open', () => {
      this.parser.on('data', (data) => {
        console.log('Received data:', data)
        this.databuffer += data
      })
    })
    this.port.on('error', (err) => {
      console.error('Error:', err.message)
    })
  }

  async open () {
    try {
      await this.port.open()
      this.portOpen = true
    } catch (err) {
      console.error('Error opening serial port:', err.message)
    }
  }

  read () {
    const data = '' + this.databuffer
    this.databuffer = ''
    return data
  }

  async write (data) {
    if (!this.portOpen) {
      await this.open()
    }
    this.port.write(data)
  }
}

module.exports = new Serial()
