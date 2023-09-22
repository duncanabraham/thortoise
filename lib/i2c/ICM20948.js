const ExternalDevice = require('../externaldevice')
const log = require('../log')

const featureOptions = {
  type: 'CORE',
  group: 'SYSTEM',
  resumeHandler: () => { },
  pauseHandler: () => { }
}
class ICM20948 extends ExternalDevice {
  constructor(options = { name: 'ICM20948', channel: 'ICM20948_data' }) {
    super(options, featureOptions)
  }

  /**
   * Handle a publish event by readingn the values into the lastData variable
   * @param {String} message
   * @param {String} channel
   */
  async _subHandler(message, channel) {
    const data = JSON.parse(message)
    if (this.verbose) {
      log.info(`ICM20948: chn: ${channel}   msg: ${data.Heading}`)
    }
    // Assuming accelData and magData are objects like { x: val, y: val, z: val }
    const accelData = { x: data.Accel0, y: data.Accel1, z: data.Accel2 }; // Replace with real accelerometer data
    const magData = { x: data.Mag0, y: data.Mag1, z: data.Mag2 }; // Replace with real magnetometer data

    // Calculate pitch and roll based on accelerometer data
    const roll = Math.atan2(accelData.y, accelData.z)
    const pitch = Math.atan2(-accelData.x, Math.sqrt(accelData.y * accelData.y + accelData.z * accelData.z))

    // Perform tilt compensation on magnetometer data
    const xh = magData.x * Math.cos(pitch) + magData.z * Math.sin(pitch)
    const yh = magData.x * Math.sin(roll) * Math.sin(pitch) + magData.y * Math.cos(roll) - magData.z * Math.sin(roll) * Math.cos(pitch)
    const zh = -magData.x * Math.cos(roll) * Math.sin(pitch) + magData.y * Math.sin(roll) + magData.z * Math.cos(roll) * Math.cos(pitch)

    // Calculate compensated heading
    let heading = Math.atan2(yh, xh)
    heading = heading * (180 / Math.PI); 

    // Correct for when the signs are reversed
    if (heading < 0) {
      heading += 360
    }
    this.roll = roll
    this.pitch = pitch
    this.heading = heading

    this.lastData = data
  }

  /**
   * Return the lastData value and perform any device specific formatting on it
   */
  get lastResult() {
    return this.lastData
  }
}

module.exports = ICM20948
