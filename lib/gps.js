class Gps {
  constructor(options) {
    this.queueSize = 10
    this.limitQueueSize = true
    Object.assign(this, options)
    setInterval(this.queueReader, 100)
    this.hadData = false
    this.lastData = []
  }

  get lastResult() {
    return this.lastData.pop() || 'Queue Empty'
  }

  /**
   * Read location from the GPS device
   */
  readLocationRequest() {
    // I don't have a node module for the Waveshare GPRS module but I do have a python example
    // TODO: shoot a request off to a message queue to get an external module to read the GPS details
  }

  queueReader() {
    // TODO: Read messages from the queue and process any destined for this module
  }

  addData(data) {
    this.lastData.push(data)
    if (this.limitQueueSize && this.lastData.length > this.queueSize) {
      this.lastData.pop()
    }
  }
}

module.exports = Gps
