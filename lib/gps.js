const net = require('net')

class GPSDClient {
  constructor () {
    this.client = new net.Socket()
    this.latestData = null
    this.isDataAvailable = false
  }

  connect () {
    this.client.connect(2947, 'localhost', () => {
      console.log('Connected to GPSD')
      this.client.write('?WATCH={"enable":true,"json":true};')
    })

    this.client.on('data', this._onData.bind(this))
    this.client.on('close', this._onClose.bind(this))
  }

  _onData (data) {
    const messages = data.toString().split('\n')
    messages.forEach(message => {
      if (message) {
        try {
          const parsed = JSON.parse(message)
          if (parsed.class === 'TPV') {
            this.latestData = parsed
            this.isDataAvailable = true
          }
        } catch (e) {
          console.error('Error parsing GPSD message:', e)
        }
      }
    })
  }

  _onClose () {
    console.log('Connection closed')
    this.isDataAvailable = false
  }

  getLatestData () {
    return this.latestData
  }

  dataAvailable () {
    return this.isDataAvailable
  }
}

module.exports = GPSDClient
