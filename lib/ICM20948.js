const i2c = require('i2c-bus')
const registers = require('./ICM20948_Registers')
const { Triplet } = require('./triplet')
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
    this.Compass = new Triplet(0, 0, 0)
    Object.assign(this, registers)
    Object.assign(this, options)
    this._init()
  }

  async _init () {
    // user bank 0 register
    this._writeByte(this.REG_ADD_REG_BANK_SEL, this.REG_VAL_REG_BANK_0)
    this._writeByte(this.REG_ADD_PWR_MIGMT_1, this.REG_VAL_ALL_RGE_RESET)
    await delay(10)
    this._writeByte(this.REG_ADD_PWR_MIGMT_1, this.REG_VAL_RUN_MODE)
    // user bank 2 register
    this._writeByte(this.REG_ADD_REG_BANK_SEL, this.REG_VAL_REG_BANK_2)
    this._writeByte(this.REG_ADD_GYRO_SMPLRT_DIV, 0x07)
    this._writeByte(this.REG_ADD_GYRO_CONFIG_1, this.REG_VAL_BIT_GYRO_DLPCFG_6 | this.REG_VAL_BIT_GYRO_FS_1000DPS | this.REG_VAL_BIT_GYRO_DLPF)
    this._writeByte(this.REG_ADD_ACCEL_SMPLRT_DIV_2, 0x07)
    this._writeByte(this.REG_ADD_ACCEL_CONFIG, this.REG_VAL_BIT_ACCEL_DLPCFG_6 | this.REG_VAL_BIT_ACCEL_FS_2g | this.REG_VAL_BIT_ACCEL_DLPF)

    this._writeByte(this.REG_ADD_MAG_CNTL2, 0x02) // enable continuous measurement mode 1
    // self.icm20948GyroOffset()
    // self.icm20948MagCheck()
    // self.icm20948WriteSecondary( I2C_ADD_ICM20948_AK09916|I2C_ADD_ICM20948_AK09916_WRITE,REG_ADD_MAG_CNTL2, REG_VAL_MAG_MODE_20HZ)
  }

  _writeByte (register, value) {
    if (this._openI2C()) {
      try {
        this.i2cReader.writeByteSync(this.i2cAddress, register, value)
      } catch (e) {
        console.log('register: ', register, '    value: ', value)
        console.error(e)
      }
      this._closeI2C()
    }
  }

  _readByte (register) {
    let value
    if (this._openI2C()) {
      try {
        value = this.i2cReader.readByteSync(this.i2cAddress, register)
      } catch (e) {
        console.log('register: ', register, '    value: ', value)
        console.error(e)
        value = 0
      }
      this._closeI2C()
      return value
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
    }
    if (n < -32766) {
      n = n + 65535
    }
    return n
  }

  /**
   * Returns numbers between -32767 to +32767
   */
  async readGyro () {
    // user bank 0 register
    this._writeByte(this.REG_ADD_REG_BANK_SEL, this.REG_VAL_REG_BANK_0)
    await delay(10)
    const x = this._signedWord(this._readHL(this.REG_ADD_GYRO_XOUT_H))
    const y = this._signedWord(this._readHL(this.REG_ADD_GYRO_YOUT_H))
    const z = this._signedWord(this._readHL(this.REG_ADD_GYRO_ZOUT_H))
    this.Gyro.import(x, y, z)
  }

  /**
   * Returns numbers between -32767 to +32767
   */
  async readAccelerometer () {
    // user bank 0 register
    this._writeByte(this.REG_ADD_REG_BANK_SEL, this.REG_VAL_REG_BANK_0)
    await delay(10)
    const x = this._signedWord(this._readHL(this.REG_ADD_ACCEL_XOUT_H))
    const y = this._signedWord(this._readHL(this.REG_ADD_ACCEL_YOUT_H))
    const z = this._signedWord(this._readHL(this.REG_ADD_ACCEL_ZOUT_H))
    this.Accelerometer.import(x, y, z)
  }

  /**
   * Range: -32752 to 32752
   */
  async readCompass () {
    // user bank 0 register
    this._writeByte(this.REG_ADD_REG_BANK_SEL, this.REG_VAL_REG_BANK_3)
    await delay(10)
    const status = this._readByte(this.REG_ADD_MAG_ST2)
    if ((status & 1) === 1) {
      const x = this._signedWord(this._readLH(this.REG_ADD_MAG_XOUT_L))
      const y = this._signedWord(this._readLH(this.REG_ADD_MAG_YOUT_L))
      const z = this._signedWord(this._readLH(this.REG_ADD_MAG_ZOUT_L))
      this.Compass.import(x, y, z)
    } else if ((status & 2) === 2) {
      // Data Overrun

    }
  }
}

module.exports = ICM20948
