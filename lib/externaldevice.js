const { REDIS_CLIENT_GETDEL_DATA_ERROR } = require('./errors')

class ExternalDevice {
  constructor(options) {
    this.queueSize = 10
    this.limitQueueSize = true
    Object.assign(this, options)
    this.lastData = []
    this.ready = false
    this.reader = setInterval(this.queueReader.bind(this), 100)
    this.name = 'DEFAULT'
  }

  /**
   * If there is an item in the array, return it, otherwise return 'Queue Empty'
   * @returns The last element of the array or 'Queue Empty'
   */
  get lastResult() {
    return this.lastData.pop() || 'Queue Empty'
  }

  /**
   * It returns true if the lastData array has a length greater than 0.
   * @returns A boolean value.
   */
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

  /**
   * It adds a timestamp to the incoming data and then adds it to the lastData array. If the
   * limitQueueSize property is set to true, it will only keep the last queueSize number of values in the
   * array
   * @param data - The data to be added to the queue
   */
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
