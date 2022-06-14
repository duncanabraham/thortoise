const i2c = require('i2c-bus')
const registers = require('./ICM20948_Registers')
const Triplet = require('./triplet')
const { delay } = require('./utils')

/**
 * The ICM20948 is a temperature and pressure sensor
 * This is part of the Waveshare Sense Hat for the Raspberry Pi
 * https://www.waveshare.com/wiki/Sense_HAT_(B)
 */
class ICM20948 {
  constructor (options = { i2cAddress: 0x68 }) {
    this.lastPitch = 0
    this.lastRoll = 0
    this.lastYaw = 0
    this.Gyro = new Triplet(0, 0, 0)
    this.Accelerometer = new Triplet(0, 0, 0)
    this.Magnetometer = new Triplet(0, 0, 0)
    Object.assign(this, registers)
    Object.assign(this, options)
    this._init()
  }

  async _init () {
    // user bank 0 register
    this._writeByte(this.REG_ADD_this.REG_BANK_SEL, this.REG_VAL_this.REG_BANK_0)
    this._writeByte(this.REG_ADD_PWR_MIGMT_1, this.REG_VAL_ALL_RGE_RESET)
    await delay(10)
    this._writeByte(this.REG_ADD_PWR_MIGMT_1, this.REG_VAL_RUN_MODE)
    // user bank 2 register
    this._writeByte(this.REG_ADD_this.REG_BANK_SEL, this.REG_VAL_this.REG_BANK_2)
    this._writeByte(this.REG_ADD_GYRO_SMPLRT_DIV, 0x07)
    this._writeByte(this.REG_ADD_GYRO_CONFIG_1, this.REG_VAL_BIT_GYRO_DLPCFG_6 | this.REG_VAL_BIT_GYRO_FS_1000DPS | this.REG_VAL_BIT_GYRO_DLPF)
    this._writeByte(this.REG_ADD_ACCEL_SMPLRT_DIV_2, 0x07)
    this._writeByte(this.REG_ADD_ACCEL_CONFIG, this.REG_VAL_BIT_ACCEL_DLPCFG_6 | this.REG_VAL_BIT_ACCEL_FS_2g | this.REG_VAL_BIT_ACCEL_DLPF)
    // user bank 0 register
    // this._writeByte(this.REG_ADD_REG_BANK_SEL , this.REG_VAL_REG_BANK_0)
    // await delay(10)
    // self.icm20948GyroOffset()
    // self.icm20948MagCheck()
    // self.icm20948WriteSecondary( I2C_ADD_ICM20948_AK09916|I2C_ADD_ICM20948_AK09916_WRITE,REG_ADD_MAG_CNTL2, REG_VAL_MAG_MODE_20HZ)
  }

  _writeByte (register, value) {
    if (this._openI2C()) {
      this.i2cReader.writeByteSync(register, value)
      this._closeI2C()
    }
  }

  _openI2C () {
    if (!this.i2cOpen) {
      this.i2cOpen = true
      this.i2cReader = i2c.openSync(1)
      return true
    } else {
      return false
    }
  }

  _closeI2C () {
    if (this.i2cOpen) {
      this.i2cReader.closeSync()
      this.i2cOpen = false
    }
  }

  _readLH (register) {
    if (this._openI2C()) {
      const l = this.i2cReader.readByteSync(this.i2cAddress, register)
      const h = this.i2cReader.readByteSync(this.i2cAddress, register + 1)
      this._closeI2C()
      return h * 256 + l
    }
  }

  _readHL (register) {
    if (this._openI2C()) {
      const h = this.i2cReader.readByteSync(this.i2cAddress, register)
      const l = this.i2cReader.readByteSync(this.i2cAddress, register + 1)
      this._closeI2C()
      return h * 256 + l
    }
  }

  _signedWord (n) {
    if (n > 32667) {
      n = n - 65535
    } else if (n <= -32767) {
      n = n + 65535
    }
  }

  /**
   * Read the angles as numbers between -32767 to +32767 which represent angles from 0 to 360 degrees
   */
  readGyro () {
    const x = this._signedWord(this._readHL(this.gyroStartRegister))
    const y = this._signedWord(this._readHL(this.gyroStartRegister + 2))
    const z = this._signedWord(this._readHL(this.gyroStartRegister + 4))
    this.Gyro.import(x, y, z)
  }

  /**
   * Read the angles as numbers between -32767 to +32767 which represent angles from 0 to 360 degrees
   */
  readAccelerometer () {
    const x = this._signedWord(this._readHL(this.accelerometerStartRegister))
    const y = this._signedWord(this._readHL(this.accelerometerStartRegister + 2))
    const z = this._signedWord(this._readHL(this.accelerometerStartRegister + 4))
    this.Accelerometer.import(x, y, z)
  }
}

module.exports = ICM20948
