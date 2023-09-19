const i2cBase = require('./i2cBase')
const registers = require('./ICM20948_Registers')

class ICM20948 extends i2cBase {
  constructor (options = { i2cAddress: 0x68 }) {
    super({ ...options, group: 'SENSOR' }, registers)
    this.initDevice()
  }

  initDevice () {
    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_0)
  }

  readTwoBytes (highRegister, lowRegister) {
    const high = this._readByte(highRegister)
    const low = this._readByte(lowRegister)
    return (high << 8) | low
  }

  async getData() {
    try {
      // Read accelerometer data
      const accelX = this.readTwoBytes(registers.REG_ADD_ACCEL_XOUT_H, registers.REG_ADD_ACCEL_XOUT_L)
      const accelY = this.readTwoBytes(registers.REG_ADD_ACCEL_YOUT_H, registers.REG_ADD_ACCEL_YOUT_L)
      const accelZ = this.readTwoBytes(registers.REG_ADD_ACCEL_ZOUT_H, registers.REG_ADD_ACCEL_ZOUT_L)

      // Read gyroscope data
      const gyroX = this.readTwoBytes(registers.REG_ADD_GYRO_XOUT_H, registers.REG_ADD_GYRO_XOUT_L)
      const gyroY = this.readTwoBytes(registers.REG_ADD_GYRO_YOUT_H, registers.REG_ADD_GYRO_YOUT_L)
      const gyroZ = this.readTwoBytes(registers.REG_ADD_GYRO_ZOUT_H, registers.REG_ADD_GYRO_ZOUT_L)

      // Read magnetometer data
      const magX = this.readTwoBytes(registers.REG_ADD_MAG_XOUT_H, registers.REG_ADD_MAG_XOUT_L)
      const magY = this.readTwoBytes(registers.REG_ADD_MAG_YOUT_H, registers.REG_ADD_MAG_YOUT_L)
      const magZ = this.readTwoBytes(registers.REG_ADD_MAG_ZOUT_H, registers.REG_ADD_MAG_ZOUT_L)

      // Calculate pitch and roll
      const pitch = Math.atan2(accelY, Math.sqrt(accelX * accelX + accelZ * accelZ)) * (180 / Math.PI)
      const roll = Math.atan2(-accelX, Math.sqrt(accelY * accelY + accelZ * accelZ)) * (180 / Math.PI)

      // Calculate yaw and compass heading (this is a basic calculation)
      const yaw = Math.atan2(magY, magX) * (180 / Math.PI)
      const compassHeading = yaw < 0 ? yaw + 360 : yaw

      return {
        pitch,
        roll,
        yaw,
        compassHeading
      }
    } catch (err) {
      console.error('Failed to read from ICM20948', err)
      return null
    }
  }
}

module.exports = ICM20948
