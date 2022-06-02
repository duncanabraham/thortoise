const ExternalDevice = require('./externaldevice')
const { REDIS_CLIENT_SET_DATA_ERROR } = require('./errors')

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

  async getDistance() { // TODO: just testing the redis queue here, need to add some real code
    await this.redisClient.set('GPS', `TESTING ${this.count}`).catch(e => {
      this.store.append('ERRORS', REDIS_CLIENT_SET_DATA_ERROR('depthai', e))
    })
    this.count++
  }

  getObjectList() {

  }
}

module.exports = DepthAI
