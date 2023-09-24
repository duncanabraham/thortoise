const ExternalDevice = require('../externaldevice')
const log = require('../log')

const featureOptions = {
  type: 'CORE',
  group: 'SYSTEM',
  resumeHandler: () => { },
  pauseHandler: () => { }
}
class QMC5883L extends ExternalDevice {
  constructor (options = { }) {
    super({ redisClient: options.redisClient, name: 'QMC5883L', channel: 'QMC5883L_data' }, featureOptions)
    this._heading = null
  }

  hasData () {
    return !!this.heading
  }

  get heading () {
    return this._heading
  }

  /**
   * Handle a publish event by readingn the values into the lastData variable
   * @param {String} message
   * @param {String} channel
   */
  async _subHandler (message, channel) {
    const data = JSON.parse(message)
    if (this.verbose) {
      log.info(`QMC8553L: chn: ${channel}   msg: ${message}`)
    }

    this._heading = data.heading

    this.lastData = data
  }

  /**
   * Return the lastData value and perform any device specific formatting on it
   */
  get lastResult () {
    return this.lastData
  }
}

module.exports = QMC5883L
