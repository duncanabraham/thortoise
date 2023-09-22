const ExternalDevice = require('../externaldevice')
const log = require('../log')

const featureOptions = {
  type: 'CORE',
  group: 'SYSTEM',
  resumeHandler: () => { },
  pauseHandler: () => { }
}
class ICM20948 extends ExternalDevice {
  constructor (options = { name: 'ICM20948', channel: 'ICM20948_data' }) {
    super(options, featureOptions)
  }

  /**
   * Handle a publish event by readingn the values into the lastData variable
   * @param {String} message
   * @param {String} channel
   */
  async _subHandler (message, channel) {
    const data = JSON.parse(message)
    log.info(`ICM20948: chn: ${channel}   msg: ${data}`)
    this.lastData = data
  }

  /**
   * Return the lastData value and perform any device specific formatting on it
   */
  get lastResult () {
    return this.lastData
  }
}

module.exports = ICM20948
