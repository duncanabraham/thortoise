const { REDIS_CLIENT_GETDEL_DATA_ERROR } = require('./errors')

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

  /**
   * Generic queue reader for any device
   * override this method for special actions
   */
  async queueReader() {
    this.redisClient.sendCommand(['GETDEL', `${this.name}-DATA`])
      .catch(e => {
        this.store.append(REDIS_CLIENT_GETDEL_DATA_ERROR('externaldevice', e))
      })
      .then(data => {
        if (data) {
          this.addData(data)
        }
      })
  }

  addData(data) {
    // Add a timestamp to the incoming data
    this.lastData.push({ data, timeStamp: new Date() })
    // Only keep "queueSize" values before dropping the oldest
    if (this.limitQueueSize && this.lastData.length > this.queueSize) {
      this.lastData.shift()
    }
  }
}

module.exports = ExternalDevice
