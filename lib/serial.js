const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline') // For parsing incoming data
const log = require('./log')
class Serial {
  constructor (uartId, baudRate) {
    this.databuffer = ''
    log.info('uartId: ', uartId)
    log.info('baud: ', baudRate)
    this.port = new SerialPort({ path: uartId, baudRate })
    this.portOpen = false
    this.lastData = []

    this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' })) // Create a parser to handle incoming data

    this.port.on('open', () => {
      this.parser.on('data', (data) => {
        log.info('Received data:', data)
        this.databuffer += data
        this.lastData.push(data)
      })
    })
    this.port.on('error', (err) => {
      log.error('Error:', err.message)
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
      log.error('Error opening serial port:', err.message)
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
