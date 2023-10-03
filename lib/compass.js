const i2c = require('i2c-bus')
const i2cBus = i2c.openSync(1)
const fs = require('fs').promises
const path = require('path')

const MPU6050_ADDRESS = 0x68
const QMC5883L_ADDRESS = 0x0D

const CHANGE_THRESHOLD = 0.03

/**
 A compass method that fuses data from an MPU6050 and a QMC5883L
 The public methods are:
  - storeMinMax() - save the current calibration data
  - create() - static factory to return an instance of compass
  - read() - return the {pitch, roll, heading} values
 */
class Compass {
  constructor (options = {}) {
    Object.assign(this, options)
    this._lastHeading = null
    this._pitch = 0
    this._roll = 0
    this.calibrationData = {
      maxX: Infinity,
      minX: -Infinity,
      maxY: Infinity,
      minY: -Infinity
    }
    this.pitchReadings = Array(10).fill(0)
    this.rollReadings = Array(10).fill(0)
    this.readingIndex = 0
  }

  async _initMinMax () {
    const filePath = path.join(__dirname, 'calibrationData.json')
    try {
      const data = await fs.readFile(filePath, 'utf8')
      this.calibrationData = JSON.parse(data)
    } catch (err) {
      // File does not exist or other error
      console.error(err)
      await this.storeMinMax()
    }
  }

  async storeMinMax () {
    const filePath = path.join(__dirname, 'calibrationData.json')
    await fs.writeFile(filePath, JSON.stringify(this.calibrationData))
  }

  _initializeSensors () {
    i2cBus.writeByteSync(QMC5883L_ADDRESS, 0x09, 0b00111101)
    i2cBus.writeByteSync(MPU6050_ADDRESS, 0x6B, 0x00)
  }

  async init () {
    await this._initMinMax()
    this._initializeSensors()
    setInterval(this._readHeading.bind(this), 200)
  }

  _readHeading () {
    // Read accelerometer data from MPU-6050
    const accelBuffer = Buffer.alloc(6)
    i2cBus.readI2cBlockSync(MPU6050_ADDRESS, 0x3B, 6, accelBuffer)
    const ax = accelBuffer.readInt16BE(0)
    const ay = accelBuffer.readInt16BE(2)
    const az = accelBuffer.readInt16BE(4)

    // Calculate pitch and roll angles
    const newPitch = Math.atan2(-ay, Math.sqrt(ax * ax + az * az))
    const newRoll = Math.atan2(ax, Math.sqrt(ay * ay + az * az))

    // Implement moving average for pitch and roll to smooth the values
    this.pitchReadings[this.readingIndex] = newPitch
    const avgPitch = this.pitchReadings.reduce((a, b) => a + b, 0) / this.pitchReadings.length

    this.rollReadings[this.readingIndex] = newRoll
    const avgRoll = this.rollReadings.reduce((a, b) => a + b, 0) / this.rollReadings.length

    // Only update roll if it has changed significantly
    if (Math.abs(avgPitch - this._pitch) > CHANGE_THRESHOLD) { this._pitch = avgPitch }
    if (Math.abs(avgRoll - this._roll) > CHANGE_THRESHOLD) { this._roll = avgRoll }

    console.log('pitch readings: ', this.pitchReadings)
    console.log('roll readings : ', this.rollReadings)

    this.readingIndex = (this.readingIndex + 1) % 10

    // Read magnetometer data from QMC5883L
    const magBuffer = Buffer.alloc(6)
    i2cBus.readI2cBlockSync(QMC5883L_ADDRESS, 0x00, 6, magBuffer)
    const x = magBuffer.readInt16LE(0)
    const y = magBuffer.readInt16LE(2)

    // Update min and max values for x and y for calibration
    if (x < this.calibrationData.minX) this.calibrationData.minX = x
    if (x > this.calibrationData.maxX) this.calibrationData.maxX = x
    if (y < this.calibrationData.minY) this.calibrationData.minY = y
    if (y > this.calibrationData.maxY) this.calibrationData.maxY = y

    // Calibrate magnetometer readings
    const calibratedX = 2 * (x - this.calibrationData.minX) / (this.calibrationData.maxX - this.calibrationData.minX) - 1
    const calibratedY = 2 * (y - this.calibrationData.minY) / (this.calibrationData.maxY - this.calibrationData.minY) - 1

    // Perform tilt correction
    const xTilt = calibratedX * Math.cos(this._pitch) + calibratedY * Math.sin(this._roll) * Math.sin(this._pitch)
    const yTilt = calibratedY * Math.cos(this._roll) - calibratedX * Math.sin(this._pitch) * Math.sin(this._roll)

    // Calculate heading in radians
    let heading = Math.atan2(yTilt, xTilt)
    if (heading < 0) {
      heading += 2 * Math.PI
    }

    // Convert to degrees
    this._lastHeading = Math.round(heading * (180 / Math.PI))
  }

  oneDec (n, places) {
    return Math.round(n * places) / places
  }

  read () {
    return {
      pitch: this.oneDec(this._pitch * (180 / Math.PI), 1),
      roll: this.oneDec(this._roll * (180 / Math.PI), 1),
      heading: this._lastHeading
    }
  }
}

// Implementation: const compass = await Compass.create(options)
module.exports = Compass
