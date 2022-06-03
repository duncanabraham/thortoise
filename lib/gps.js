const { REDIS_CLIENT_READ_ERROR } = require('./errors')
const ExternalDevice = require('./externaldevice')

/**
 * Request GPS positional information from the WaveShare SIM868 module
 * The code for this is in Python so it will need to be requested over an external message queue
 */
class Gps extends ExternalDevice {
  constructor(options) {
    super(options)
    this.name = 'GPS'
  }

  /**
   * Read location from the GPS device
   */
  async readLocationRequest() {
    await this.redisClient.set(`${this.name}-REQ`, 'GETGPS').catch(e => {
      this.store.append('ERRORS', REDIS_CLIENT_READ_ERROR('gps', e))
    })
  }
}

module.exports = Gps
