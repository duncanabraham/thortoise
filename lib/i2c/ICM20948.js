const i2cBase = require('./i2cBase')
const registers = require('./ICM20948_Registers')
const log = require('../log') // Your logging library

class ICM20948 extends I2cBase {
  constructor(options = {i2cAddress: 0x68}, additional = {}) {
    super(options, registers)

    this._initializeICM20948()
  }

  _initializeICM20948() {
    this._writeByte(this.REG_ADD_PWR_MGMT_1, 0x41) // Reset the device
  }

  _calculateEulerAngles(ax, ay, az, gx, gy, gz, mx, my, mz) {
    const roll = Math.atan2(ay, az) * 180 / Math.PI
    const pitch = Math.atan2(-ax, Math.sqrt(ay * ay + az * az)) * 180 / Math.PI
    const yaw = Math.atan2(my, mx) * 180 / Math.PI

    let heading = Math.atan2(my, mx)
    if (heading < 0) {
      heading += 2 * Math.PI
    }
    heading = heading * (180 / Math.PI)

    return { pitch, roll, yaw, heading }
  }

  getData() {
    const ax = this._readWord(this.REG_ADD_ACCEL_XOUT_H) // Accelerometer X-axis (example register)
    const ay = this._readWord(this.REG_ADD_ACCEL_YOUT_H) // Accelerometer Y-axis (example register)
    const az = this._readWord(this.REG_ADD_ACCEL_ZOUT_H) // Accelerometer Z-axis (example register)

    const gx = this._readWord(this.REG_ADD_GYRO_XOUT_H) // Gyroscope X-axis (example register)
    const gy = this._readWord(this.REG_ADD_GYRO_YOUT_H) // Gyroscope Y-axis (example register)
    const gz = this._readWord(this.REG_ADD_GYRO_ZOUT_H) // Gyroscope Z-axis (example register)

    const mx = this._readWord(this.REG_ADD_MAG_XOUT_H) // Magnetometer X-axis (example register)
    const my = this._readWord(this.REG_ADD_MAG_YOUT_H) // Magnetometer Y-axis (example register)
    const mz = this._readWord(this.REG_ADD_MAG_ZOUT_H) // Magnetometer Z-axis (example register)

    // Convert the raw data to Euler angles and heading
    return this._calculateEulerAngles(ax, ay, az, gx, gy, gz, mx, my, mz)
  }
}

module.exports = ICM20948

