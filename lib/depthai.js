const ExternalDevice = require('./externaldevice')
const { REDIS_CLIENT_SET_DATA_ERROR } = require('./errors')

/**
 * Request depth and object data by reading the OAK-D Lite camera
 * The code for this is in Python so it will need to be requested over an external message queue
 */
class DepthAI extends ExternalDevice {
  constructor(options) {
    super(options)
    this.name = 'DEPTHAI'
  }

  /**
   * It sets the value of the key `depthai-REQ` to `GETDISTANCE`
   */
  async getDistance() { // TODO: just testing the redis queue here, need to add some real code
    await this.redisClient.set(`${this.name}-REQ`, 'GETDISTANCE').catch(e => {
      this.store.append('ERRORS', REDIS_CLIENT_SET_DATA_ERROR('depthai:getDistance', e))
    })
  }

  /**
   * It sets the value of the key `depthai-REQ` to `GETOBJECTS`
   */
  async getObjectList() {
    await this.redisClient.set(`${this.name}-REQ`, 'GETOBJECTS').catch(e => {
      this.store.append('ERRORS', REDIS_CLIENT_SET_DATA_ERROR('depthai:getObjectList', e))
    })
  }
}

module.exports = DepthAI
