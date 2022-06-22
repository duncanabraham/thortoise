const i2cBase = require('./i2cBase')
const registers = require('./ICM20948_Registers')
const { Triplet } = require('../triplet')
const { delay } = require('../utils')

/**
 * The ICM20948 is a temperature and pressure sensor
 * This is part of the Waveshare Sense Hat for the Raspberry Pi
 * https://www.waveshare.com/wiki/Sense_HAT_(B)
 *
 * Most of this is translated from Python:
 * https://github.com/sparkfun/Qwiic_9DoF_IMU_ICM20948_Py/blob/b3202b06eb3ab88b0c57d814bdbf5aa3b6380747/qwiic_icm20948.py#L803
 */
class ICM20948 extends i2cBase {
  constructor (options = { i2cAddress: 0x68 }) {
    super(options, registers)
    this.lastPitch = 0
    this.lastRoll = 0
    this.lastYaw = 0
    this.Gyro = new Triplet(0, 0, 0)
    this.Accelerometer = new Triplet(0, 0, 0)
    this.Compass = new Triplet(9, 9, 9)
    this.Temperature = 0
    this._init()
  }

  async _init () {
    await this._begin()
  }

  _icm20948I2cMasterSlaveTxn (addr, reg, data, Rw, sendRegAddr) {
    if (Rw) { addr = (addr | 0x80) }
    this.setBank(this.REG_VAL_REG_BANK_3)
    this._writeByte(this.REG_ADD_I2C_SLV4_ADDR, addr)
    this._writeByte(this.REG_ADD_I2C_SLV4_REG, reg)

    let ctrlRegisterSlv4 = 0x00
    ctrlRegisterSlv4 |= (1 << 7) //  EN bit [7] (set)
    ctrlRegisterSlv4 &= ~(1 << 6) // INT_EN bit [6] (cleared)
    ctrlRegisterSlv4 &= ~(0x0F) // DLY bits [4:0] (cleared = 0)

    ctrlRegisterSlv4 = sendRegAddr ? (ctrlRegisterSlv4 &= ~(1 << 5)) : ctrlRegisterSlv4 |= (1 << 5)

    let txnFailed = false

    if (!Rw) {
      this._writeByte(this.REG_ADD_I2C_SLV4_D0, data)
    }

    // Kick off txn
    this._writeByte(this.REG_ADD_I2C_SLV4_CTRL, ctrlRegisterSlv4)

    const maxCycles = 1000
    let count = 0
    let slave4Done = false

    this.setBank(this.REG_VAL_REG_BANK_0)
    let i2cMstStatus
    while (!slave4Done) {
      i2cMstStatus = this._readByte(this.REG_ADD_I2C_MST_STATUS)

      slave4Done = i2cMstStatus & (1 << 6) // Check I2C_SLAVE_DONE bit [6]
      slave4Done = count > maxCycles

      count++
    }

    txnFailed = (i2cMstStatus & (1 << 4)) || count > maxCycles // Check I2C_SLV4_NACK bit[4]

    if (txnFailed) { return false }

    if (Rw) {
      this.setBank(this.REG_VAL_REG_BANK_3)
      return this._readByte(this.REG_ADD_I2C_SLV4_DI)
    }

    return true // if we get here, then it was a successful write
  }

  _i2cMasterSingleW (addr, reg, data) {
    return this._icm20948I2cMasterSlaveTxn(addr, reg, data, false, true)
  }

  _i2cMasterSingleR (addr, reg) {
    return this._icm20948I2cMasterSlaveTxn(addr, reg, 0, true, true)
  }

  _writeMag (reg, data) {
    return this._i2cMasterSingleW(this.I2C_ADD_ICM20948_AK09916, reg, data)
  }

  _readMag (reg) {
    return this._i2cMasterSingleR(this.I2C_ADD_ICM20948_AK09916, reg)
  }

  _magWhoIAm () {
    const WIA1 = this._readMag(this.REG_ADD_MAG_WIA1)
    const WIA2 = this._readMag(this.REG_ADD_MAG_WIA2)
    return WIA1 === 0x48 && WIA2 === 0x09
  }

  _i2cMasterReset () {
    this.setBank(this.REG_VAL_REG_BANK_0)
    const register = this._readByte(this.REG_ADD_USER_CTRL)
    this._writeByte(this.REG_ADD_USER_CTRL, (register | 0x02)) // set the reset bit
  }

  _i2cMasterConfigureSlave (slave, addr, reg, len, Rw, enable, dataOnly, grp, swap) {
    let slvAddrReg = 0x00
    let slvRegReg = 0x00
    let slvCtrlReg = 0x00

    switch (slave) {
      case 0:
        slvAddrReg = this.REG_ADD_I2C_SLV0_ADDR
        slvRegReg = this.REG_ADD_I2C_SLV0_REG
        slvCtrlReg = this.REG_ADD_I2C_SLV0_CTRL
        break
      case 1:
        slvAddrReg = this.REG_ADD_I2C_SLV1_ADDR
        slvRegReg = this.REG_ADD_I2C_SLV1_REG
        slvCtrlReg = this.REG_ADD_I2C_SLV1_CTRL
        break
      case 2:
        slvAddrReg = this.REG_ADD_I2C_SLV2_ADDR
        slvRegReg = this.REG_ADD_I2C_SLV2_REG
        slvCtrlReg = this.REG_ADD_I2C_SLV2_CTRL
        break
      case 3:
        slvAddrReg = this.REG_ADD_I2C_SLV3_ADDR
        slvRegReg = this.REG_ADD_I2C_SLV3_REG
        slvCtrlReg = this.REG_ADD_I2C_SLV3_CTRL
        break
      default:
        return false
    }
    this.setBank(this.REG_VAL_REG_BANK_3)

    // Set the slave address and the Rw flag
    const address = Rw ? addr |= (1 << 7) : addr
    this._writeByte(slvAddrReg, address)

    // Set the slave sub-address (reg)
    this._writeByte(slvRegReg, reg)

    // Set up the control info
    let ctrlRegSlvX = 0x00
    ctrlRegSlvX |= len
    ctrlRegSlvX |= (enable << 7)
    ctrlRegSlvX |= (swap << 6)
    ctrlRegSlvX |= (dataOnly << 5)
    ctrlRegSlvX |= (grp << 4)
    this._writeByte(slvCtrlReg, ctrlRegSlvX)
  }

  startupMagnetometer () {
    this._i2cMasterEnable(true)
    let tries = 0
    const maxTries = 5
    while (tries < maxTries && !this._magWhoIAm()) {
      this._i2cMasterReset()
      tries++
    }
    // if (tries === maxTries) {
    //   console.error('Mag ID Failed')
    //   process.exit(0)
    // }

    let magRegCtrl2 = 0x00
    magRegCtrl2 |= this.REG_VAL_MAG_MODE_100HZ

    this._writeMag(this.REG_ADD_MAG_CNTL2, magRegCtrl2)
    return this._i2cMasterConfigureSlave(0, this.I2C_ADD_ICM20948_AK09916, this.REG_VAL_MAG_MODE_ST1, 9, true, true, false, false, false)
  }

  _i2cMasterPassthrough (passthrough) { // Enable or Disable i2c passthrough
    this.setBank(this.REG_VAL_REG_BANK_0)
    let register = this._readByte(this.REG_INT_PIN_CONFIG)
    register = passthrough ? (register |= (1 << 1)) : (register &= ~(1 << 1))
    this._writeByte(this.REG_INT_PIN_CONFIG, register)
  }

  _i2cMasterEnable (enable) {
    this._i2cMasterPassthrough(false)
    this.setBank(this.REG_VAL_REG_BANK_3)

    // Setup master clock
    let register = this._readByte(this.REG_ADD_I2C_MST_CTRL)
    register &= ~(0x0F)
    register |= (0x07) // set master clock to 345.6KHz
    register |= (1 << 4) // set NSR 0 = restart between reads 1 = stop between reads
    this._writeByte(this.REG_ADD_I2C_MST_CTRL, register)

    // Enable / Disable Master I2C
    this.setBank(this.REG_VAL_REG_BANK_0)
    register = this._readByte(this.REG_ADD_USER_CTRL)
    register = enable ? (register |= (1 << 5)) : (register &= ~(1 << 5))
    this._writeByte(this.REG_ADD_USER_CTRL, register)
  }

  setBank (bank) {
    bank = ((bank << 4) & 0x30)
    this._writeByte(this.REG_ADD_REG_BANK_SEL, bank)
  }

  async swReset () {
    this.setBank(this.REG_VAL_REG_BANK_0)
    let register = this._readByte(this.REG_ADD_PWR_MGMT_1)
    register |= (1 << 7) // set bit 7
    this._writeByte(this.REG_ADD_PWR_MGMT_1, register)
    await delay(50)
  }

  dataReady () {
    this.setBank(this.REG_VAL_REG_BANK_0)
    const register = this._readByte(this.REG_INT_STATUS_1)
    return register & (1 << 0)
  }

  getData () {
    const sensitivity = 1
    this.setBank(this.REG_VAL_REG_BANK_0)
    const gx = this._toSignedInt(this._readHL(this.REG_ADD_GYRO_XOUT_H))
    const gy = this._toSignedInt(this._readHL(this.REG_ADD_GYRO_YOUT_H))
    const gz = this._toSignedInt(this._readHL(this.REG_ADD_GYRO_ZOUT_H))
    this.Gyro.import(gx, gy, gz)
    const ax = this._toSignedInt(this._readHL(this.REG_ADD_ACCEL_XOUT_H))
    const ay = this._toSignedInt(this._readHL(this.REG_ADD_ACCEL_YOUT_H))
    const az = this._toSignedInt(this._readHL(this.REG_ADD_ACCEL_ZOUT_H))
    this.Accelerometer.import(ax, ay, az)
    const mx = this._toSignedInt(this._readHL(this.REG_ADD_MAG_XOUT_H))
    const my = this._toSignedInt(this._readHL(this.REG_ADD_MAG_YOUT_H))
    const mz = this._toSignedInt(this._readHL(this.REG_ADD_MAG_ZOUT_H))
    this.Compass.import(mx, my, mz)
    this.Temperature = ((this._readHL(this.REG_ADD_TEMP_H) - 21) / sensitivity) + 21
  }

  sleep (enable) {
    this.setBank(this.REG_VAL_REG_BANK_0)
    let register = this._readByte(this.REG_ADD_PWR_MGMT_1)
    register = enable ? register |= (1 << 6) : register &= ~(1 << 6)
    this._writeByte(this.REG_ADD_PWR_MGMT_1, register)
  }

  lowPower (enable) {
    this.setBank(this.REG_VAL_REG_BANK_0)
    let register = this._readByte(this.REG_ADD_PWR_MGMT_1)
    register = enable ? register |= (1 << 5) : register &= ~(1 << 5)
    this._writeByte(this.REG_ADD_PWR_MGMT_1, register)
  }

  setSampleMode (sensors, mode) {
    this.setBank(this.REG_VAL_REG_BANK_0)
    let register = this._readByte(this.REG_ADD_LP_CONFIG)
    if (sensors & this.ICM_20948_Internal_Acc) {
      // Set/clear the sensor specific sample mode bit as needed
      register = mode === this.ICM_20948_Sample_Mode_Cycled ? register |= (1 << 5) : mode === this.ICM_20948_Sample_Mode_Continuous ? register &= ~(1 << 5) : register
    }
    if (sensors & this.ICM_20948_Internal_Gyr) {
      // Set/clear the sensor specific sample mode bit as needed
      register = mode === this.ICM_20948_Sample_Mode_Cycled ? register |= (1 << 4) : mode === this.ICM_20948_Sample_Mode_Continuous ? register &= ~(1 << 4) : register
    }
    if (sensors & this.ICM_20948_Internal_Mst) {
      // Set/clear the sensor specific sample mode bit as needed
      register = mode === this.ICM_20948_Sample_Mode_Cycled ? register |= (1 << 6) : mode === this.ICM_20948_Sample_Mode_Continuous ? register &= ~(1 << 6) : register
    }
    this._writeByte(this.REG_ADD_LP_CONFIG, register)
  }

  setFullScaleRangeAccel (mode) {
    this.setBank(this.REG_VAL_REG_BANK_2)
    let register = this._readByte(this.REG_ADD_ACCEL_CONFIG)
    register &= ~(0b00000110)
    register |= (mode << 1)
    this._writeByte(this.REG_ADD_ACCEL_CONFIG, register)
  }

  setFullScaleRangeGyro (mode) {
    this.setBank(this.REG_VAL_REG_BANK_2)
    let register = this._readByte(this.REG_ADD_GYRO_CONFIG_1)
    register &= ~(0b00000110)
    register |= (mode << 1)
    this._writeByte(this.REG_ADD_GYRO_CONFIG_1, register)
  }

  setDLPFcfgAccel (dlpcfg) {
    this.setBank(this.REG_VAL_REG_BANK_2)
    let register = this._readByte(this.REG_ADD_ACCEL_CONFIG)
    register &= ~(0b00111000)
    register |= (dlpcfg << 3)
    this._writeByte(this.REG_ADD_ACCEL_CONFIG, register)
  }

  setDLPFcfgGyro (dlpcfg) {
    this.setBank(this.REG_VAL_REG_BANK_2)
    let register = this._readByte(this.REG_ADD_GYRO_CONFIG_1)
    register &= ~(0b00111000)
    register |= (dlpcfg << 3)
    this._writeByte(this.REG_ADD_GYRO_CONFIG_1, register)
  }

  enableDlpfAccel (enabled) {
    this.setBank(this.REG_VAL_REG_BANK_2)
    let register = this._readByte(this.REG_ADD_ACCEL_CONFIG)
    register = enabled ? register |= (1 << 0) : register &= ~(1 << 0)
    this._writeByte(this.REG_ADD_ACCEL_CONFIG, register)
  }

  enableDlpfGyro (enabled) {
    this.setBank(this.REG_VAL_REG_BANK_2)
    let register = this._readByte(this.REG_ADD_GYRO_CONFIG_1)
    register = enabled ? register |= (1 << 0) : register &= ~(1 << 0)
    this._writeByte(this.REG_ADD_GYRO_CONFIG_1, register)
  }

  async _begin () {
    this.setBank(this.REG_VAL_REG_BANK_0)
    const chipId = this._readByte(this.REG_ADD_WIA)
    if (chipId !== 0xEA) {
      console.log('Invalid chip ID: ', chipId)
    }

    await this.swReset()
    this.sleep(false)
    this.lowPower(false)
    this.setSampleMode((this.ICM_20948_Internal_Acc | this.ICM_20948_Internal_Gyr), this.ICM_20948_Sample_Mode_Continuous)

    this.setFullScaleRangeAccel(0x00) // 0x00 = G forces +/-
    this.setFullScaleRangeGyro(0x00) // degrees per second (dps)

    this.setDLPFcfgAccel(0x07)
    this.setDLPFcfgGyro(0x07)

    this.enableDlpfAccel(false)
    this.enableDlpfGyro(false)

    this.startupMagnetometer()
  }
}

module.exports = ICM20948
