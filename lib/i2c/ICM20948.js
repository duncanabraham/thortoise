const registers = require('./ICM20948_Registers')
const i2cBase = require('./i2cBase') // Import your existing i2cBase class
const { delay } = require('../utils')
const log = require('../log')

const { atan2, sqrt, PI, cos, sin } = Math

class ICM20948 extends i2cBase {
  constructor(options = { i2cAddress: 0x68 }) {
    super(options, registers) // Calling the constructor of the parent class
    this.gyro = [0, 0, 0]
    this.gyroOffset = [0, 0, 0]
    this.accel = [0, 0, 0]
    this.mag = [0, 0, 0]
    this.pitch = 0.0
    this.roll = 0.0
    this.yaw = 0.0
    this.pu8data = [0, 0, 0, 0, 0, 0, 0, 0]
    this.U8tempX = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.U8tempY = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.U8tempZ = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.mag = [0, 0, 0]
    this._initialize()
  }

  icm20948GyroAccelRead() {
    console.log('icm20948GyroAccelRead')
    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_0)
    const accelX = this._readWord(registers.REG_ADD_ACCEL_XOUT_H)
    const accelY = this._readWord(registers.REG_ADD_ACCEL_YOUT_H)
    const accelZ = this._readWord(registers.REG_ADD_ACCEL_ZOUT_H)

    const gyroX = this._readWord(registers.REG_ADD_GYRO_XOUT_H)
    const gyroY = this._readWord(registers.REG_ADD_GYRO_YOUT_H)
    const gyroZ = this._readWord(registers.REG_ADD_GYRO_ZOUT_H)

    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_2)
    this.accel[0] = this._twosComp(accelX)
    this.accel[1] = this._twosComp(accelY)
    this.accel[2] = this._twosComp(accelZ)

    this.gyro[0] = this._twosComp((gyroX) - this.gyroOffset[0])
    this.gyro[1] = this._twosComp((gyroY) - this.gyroOffset[1])
    this.gyro[2] = this._twosComp((gyroZ) - this.gyroOffset[2])
  }

  async icm20948GyroOffset() {
    console.log('icm20948GyroOffset')
    let s32TempGx = 0
    let s32TempGy = 0
    let s32TempGz = 0
    for (let i = 0; i < 32; i++) {
      this.icm20948GyroAccelRead()
      s32TempGx += this.gyro[0]
      s32TempGy += this.gyro[1]
      s32TempGz += this.gyro[2]
      await delay(100)
    }
    this.gyroOffset[0] = s32TempGx >> 5
    this.gyroOffset[1] = s32TempGy >> 5
    this.gyroOffset[2] = s32TempGz >> 5
  }

  async icm20948ReadSecondary(u8I2CAddr, u8RegAddr, u8Len) {
    console.log('icm20948ReadSecondary 1', u8I2CAddr, ' : ', u8RegAddr, ' : ', u8Len)
    let u8Temp = 0
    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_3)
    this._writeByte(registers.REG_ADD_I2C_SLV0_ADDR, u8I2CAddr)
    this._writeByte(registers.REG_ADD_I2C_SLV0_REG, u8RegAddr)
    this._writeByte(registers.REG_ADD_I2C_SLV0_CTRL, registers.REG_VAL_BIT_SLV0_EN | u8Len)

    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_0)
    console.log('icm20948ReadSecondary 2')
    u8Temp = this._readByte(registers.REG_ADD_USER_CTRL)
    u8Temp |= registers.REG_VAL_BIT_I2C_MST_EN
    this._writeByte(registers.REG_ADD_USER_CTRL, u8Temp)
    await delay(10)
    console.log('icm20948ReadSecondary 3')
    u8Temp &= ~registers.REG_VAL_BIT_I2C_MST_EN
    this._writeByte(registers.REG_ADD_USER_CTRL, u8Temp)

    for (let i = 0; i < u8Len; i++) {
      this.pu8data[i] = this._readByte(registers.REG_ADD_EXT_SENS_DATA_00 + i)
    }
    console.log('icm20948ReadSecondary 4', this.pu8data)
    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_3)

    u8Temp = this._readByte(registers.REG_ADD_I2C_SLV0_CTRL)
    u8Temp &= ~((registers.REG_VAL_BIT_I2C_MST_EN) & (registers.REG_VAL_BIT_MASK_LEN))
    this._writeByte(registers.REG_ADD_I2C_SLV0_CTRL, u8Temp)
    console.log('icm20948ReadSecondary 5')
    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_0)
    console.log('icm20948ReadSecondary 6')
  }

  icm20948MagCheck() {
    console.log('icm20948MagCheck')
    this.icm20948ReadSecondary(registers.I2C_ADD_ICM20948_AK09916 | registers.I2C_ADD_ICM20948_AK09916_READ, registers.REG_ADD_MAG_WIA1, 2)
    const bRet = (this.pu8data[0] == registers.REG_VAL_MAG_WIA1) && (this.pu8data[1] == registers.REG_VAL_MAG_WIA2)
    return bRet
  }

  async icm20948WriteSecondary(u8I2CAddr, u8RegAddr, u8data) {
    console.log('icm20948WriteSecondary')
    let u8Temp = 0
    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_3)
    this._writeByte(registers.REG_ADD_I2C_SLV1_ADDR, u8I2CAddr)
    this._writeByte(registers.REG_ADD_I2C_SLV1_REG, u8RegAddr)
    this._writeByte(registers.REG_ADD_I2C_SLV1_DO, u8data)
    this._writeByte(registers.REG_ADD_I2C_SLV1_CTRL, registers.REG_VAL_BIT_SLV0_EN | 1)

    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_0)

    u8Temp = this._readByte(registers.REG_ADD_USER_CTRL)
    u8Temp |= registers.REG_VAL_BIT_I2C_MST_EN
    this._writeByte(registers.REG_ADD_USER_CTRL, u8Temp)
    await delay(10)

    u8Temp &= ~registers.REG_VAL_BIT_I2C_MST_EN
    this._writeByte(registers.REG_ADD_USER_CTRL, u8Temp)

    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_3)

    u8Temp = this._readByte(registers.REG_ADD_I2C_SLV0_CTRL)
    u8Temp &= ~((registers.REG_VAL_BIT_I2C_MST_EN) & (registers.REG_VAL_BIT_MASK_LEN))
    this._writeByte(registers.REG_ADD_I2C_SLV0_CTRL, u8Temp)

    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_0)
  }

  async _initialize() {
    log.info('Initializing Sensors - Starting')
    // Reset and set in run mode
    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_0)
    this._writeByte(registers.REG_ADD_PWR_MGMT_1, registers.REG_VAL_ALL_RGE_RESET)
    await delay(100)

    this._writeByte(registers.REG_ADD_PWR_MGMT_1, registers.REG_VAL_RUN_MODE)

    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_2)
    this._writeByte(registers.REG_ADD_GYRO_SMPLRT_DIV, 0x07)
    this._writeByte(registers.REG_ADD_GYRO_CONFIG_1, registers.REG_VAL_BIT_GYRO_DLPCFG_6 | registers.REG_VAL_BIT_GYRO_FS_1000DPS | registers.REG_VAL_BIT_GYRO_DLPF)
    this._writeByte(registers.REG_ADD_ACCEL_SMPLRT_DIV_2, 0x07)
    this._writeByte(registers.REG_ADD_ACCEL_CONFIG, registers.REG_VAL_BIT_ACCEL_DLPCFG_6 | registers.REG_VAL_BIT_ACCEL_FS_2g | registers.REG_VAL_BIT_ACCEL_DLPF)

    this._writeByte(registers.REG_ADD_REG_BANK_SEL, registers.REG_VAL_REG_BANK_0)
    await delay(100)

    await this.icm20948GyroOffset()
    await this.icm20948MagCheck()
    await this.icm20948WriteSecondary(registers.I2C_ADD_ICM20948_AK09916 | registers.I2C_ADD_ICM20948_AK09916_WRITE, registers.REG_ADD_MAG_CNTL2, registers.REG_VAL_MAG_MODE_20HZ)
    log.info('Initializing Sensors - Complete')
  }


  async _readSensorData() {
    console.log('_readSensorData()')
    // Read the accelerometer
    const accelX = this._readWord(registers.REG_ADD_ACCEL_XOUT_H)
    const accelY = this._readWord(registers.REG_ADD_ACCEL_YOUT_H)
    const accelZ = this._readWord(registers.REG_ADD_ACCEL_ZOUT_H)
    // Read the magnetometer
    const magX = this._readWord(registers.REG_ADD_MAG_XOUT_H)
    const magY = this._readWord(registers.REG_ADD_MAG_YOUT_H)
    const magZ = this._readWord(registers.REG_ADD_MAG_ZOUT_H)

    return { accelX, accelY, accelZ, magX, magY, magZ }
  }

  async _calculateOrientation(sensorData) {
    console.log('_calculateOrientation')
    const { accelX, accelY, accelZ, magX, magY, magZ } = sensorData

    // Calculate Roll, Pitch, and Yaw
    const roll = atan2(accelY, accelZ) * (180 / PI)
    const pitch = atan2(-accelX, sqrt(accelY * accelY + accelZ * accelZ)) * (180 / PI)

    // Calculate Yaw using magnetometer and roll, pitch values
    const magXComp = magX * cos(pitch) + magZ * sin(pitch)
    const magYComp = magX * sin(roll) * sin(pitch) + magY * cos(roll) - magZ * sin(roll) * cos(pitch)
    const yaw = atan2(magYComp, magXComp) * (180 / PI)

    // Calculate compass heading
    let heading = yaw
    if (heading < 0) heading += 360
    const mag = await this.icm20948MagRead()
    return { pitch, roll, yaw, heading, mag }
  }

  async icm20948MagRead() {
    console.log('icm20948MagRead')
    let counter = 20
    let ended = false
    while (counter > 0 && !ended) {
      await delay(10)
      this.icm20948ReadSecondary(registers.I2C_ADD_ICM20948_AK09916 | registers.I2C_ADD_ICM20948_AK09916_READ, registers.REG_ADD_MAG_ST2, 1)
      if ((this.pu8data[0] & 0x01) != 0) {
        ended = true
      } else {
        counter -= 1
      }
    }
    if (counter != 0) {
      for (let i = 0; i < 8; i++) {
        this.icm20948ReadSecondary(registers.I2C_ADD_ICM20948_AK09916 | registers.I2C_ADD_ICM20948_AK09916_READ, registers.REG_ADD_MAG_DATA, registers.MAG_DATA_LEN)

        this.U8tempX[i] = (this.pu8data[1] << 8) | this.pu8data[0]
        this.U8tempY[i] = (this.pu8data[3] << 8) | this.pu8data[2]
        this.U8tempZ[i] = (this.pu8data[5] << 8) | this.pu8data[4]
      }

      this.mag[0] = (this.U8tempX[0] + this.U8tempX[1] + this.U8tempX[2] + this.U8tempX[3] + this.U8tempX[4] + this.U8tempX[5] + this.U8tempX[6] + this.U8tempX[7]) / 8
      this.mag[1] = -(this.U8tempY[0] + this.U8tempY[1] + this.U8tempY[2] + this.U8tempY[3] + this.U8tempY[4] + this.U8tempY[5] + this.U8tempY[6] + this.U8tempY[7]) / 8
      this.mag[2] = -(this.U8tempZ[0] + this.U8tempZ[1] + this.U8tempZ[2] + this.U8tempZ[3] + this.U8tempZ[4] + this.U8tempZ[5] + this.U8tempZ[6] + this.U8tempZ[7]) / 8
    }
    this.mag[0] = this._twosComp(this.mag[0])
    this.mag[1] = this._twosComp(this.mag[1])
    this.mag[2] = this._twosComp(this.mag[2])
  }

  async getData() {
    const sensorData = await this._readSensorData()
    const orientation = await this._calculateOrientation(sensorData)
    return orientation
  }
}

module.exports = ICM20948
