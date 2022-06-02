

class ExternalDevice {
  constructor(options) {
    this.queueSize = 10
    this.limitQueueSize = true
    Object.assign(this, options)
    this.lastData = []
    this.ready = false
    setInterval(this.queueReader.bind(this), 100)
    this.name = 'DEFAULT'
  }

  get lastResult() {
    return this.lastData.pop() || 'Queue Empty'
  }

  get hasData() {
    return this.lastData.length > 0
  }

  async queueReader() {
    this.redisClient.sendCommand(['GETDEL', this.name])
      .catch(e => {
        console.error('Oops 2: ', e)
      })
      .then(data => {
        if (data) {
          this.addData(data)
        }
      })
  }

  addData(data) {
    this.lastData.push(data)
    if (this.limitQueueSize && this.lastData.length > this.queueSize) {
      this.lastData.shift()
    }
    console.log('externalData: addData: ', this.lastData)
  }
}

module.exports = ExternalDevice
