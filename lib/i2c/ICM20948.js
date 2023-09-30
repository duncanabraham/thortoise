const ExternalDevice = require('../externaldevice')
const log = require('../log')
const madgwick = require('../madgwick')
const { options: config } = require('../../config')

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
    if (config.verbose) {
      log.info(`ICM20948: chn: ${channel}   msg: ${message}`)
    }

    // Use the madgwick filter to perform the fusion calculations
    const result = madgwick(data.Gyro0, data.Gyro1, data.Gyro2, data.Accel0, data.Accel1, data.Accel2, data.Mag0, data.Mag1, data.Mag2)
    if (config.verbose) {
      log.info(`ICM20948: angles: ${JSON.parse(result)}`)
    }
    this.roll = result.roll
    this.pitch = result.pitch
    this.yaw = result.yaw
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
