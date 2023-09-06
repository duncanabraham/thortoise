const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline') // For parsing incoming data

class Serial {
  constructor (uartId, baudRate) {
    this.databuffer = ''
    console.log('uartId: ', uartId)
    console.log('baud: ', baudRate)
    this.port = new SerialPort({ path: uartId, baudRate })
    this.portOpen = false
    this.lastData = []

    this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' })) // Create a parser to handle incoming data

    this.port.on('open', () => {
      this.parser.on('data', (data) => {
        console.log('Received data:', data)
        this.databuffer += data
        this.lastData.push(data)
      })
    })
    this.port.on('error', (err) => {
      console.error('Error:', err.message)
    })
  }

  get output () {
    const result = [].concat(this.lastData)
    this.lastData = []
    return result
  }

  async open () {
    try {
      this.port.open()
      this.portOpen = true
    } catch (err) {
      console.error('Error opening serial port:', err.message)
    }
  }

  async close () {
    this.port.close()
  }

  read () {
    const data = '' + this.databuffer
    this.databuffer = ''
    return data
  }

  async write (data) {
    // if (!this.portOpen) {
    //   await this.open()
    // }
    this.port.write(data)
  }
}

module.exports = Serial
