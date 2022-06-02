const ExternalDevice = require('./externaldevice')

/**
 * Request depth and object data by reading the OAK-D Lite camera
 * The code for this is in Python so it will need to be requested over an external message queue
 */
class DepthAI extends ExternalDevice {
  constructor(options) {
    super(options)
    Object.assign(this, options)
    this.name = 'DEPTHAI'
    setInterval(this.getDistance.bind(this), 500)
    this.count = 0
  }

  async getDistance() {
    await this.redisClient.set('GPS', `TESTING ${this.count}`).catch(e => {
      console.error('oops depth: ', e)
    })
    this.count++
  }

  getObjectList() {

  }
}

module.exports = DepthAI
