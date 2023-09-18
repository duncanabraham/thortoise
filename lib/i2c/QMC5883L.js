// see: https://github.com/artus9033/NodeJS-QMC5883L/blob/master/src/MechaQMC5883.cpp

const I2cBase = require('./i2cBase')

const registers = {
  REG_XOUT_LSB: 0x00, // Output Data Registers for magnetic sensor.
  REG_XOUT_MSB: 0x01,
  REG_YOUT_LSB: 0x02,
  REG_YOUT_MSB: 0x03,
  REG_ZOUT_LSB: 0x04,
  REG_ZOUT_MSB: 0x05,
  REG_STATUS_1: 0x06, // Status Register.
  REG_TOUT_LSB: 0x07, // Output Data Registers for temperature.
  REG_TOUT_MSB: 0x08,
  REG_CONTROL_1: 0x09, // Control Register //1.
  REG_CONTROL_2: 0x0a, // Control Register //2.
  REG_RST_PERIOD: 0x0b, // SET / RESET Period Register.
  REG_CHIP_ID: 0x0d, // Chip ID register.

  // Flags for Status Register //1.
  STAT_RDY: 0b00000001, // Data Ready.
  STAT_OVL: 0b00000010, // Overflow flag.
  STAT_DOR: 0b00000100, // Data skipped for reading.

  // Flags for Status Register //2.
  INT_ENB: 0b00000001, // Interrupt Pin Enabling.
  POL_PNT: 0b01000000, // Pointer Roll - over.
  SOFT_RST: 0b10000000, // Soft Reset.

  // Flags for Control Register 1.
  MODE_STBY: 0b00000000, // Standby mode.
  MODE_CONT: 0b00000001, // Continuous read mode.
  ODR_10HZ: 0b00000000, // Output Data Rate Hz.
  ODR_50HZ: 0b00000100,
  ODR_100HZ: 0b00001000,
  ODR_200HZ: 0b00001100,
  RNG_2G: 0b00000000, // Range 2 Gauss: for magnetic - clean environments.
  RNG_8G: 0b00010000, // Range 8 Gauss: for strong magnetic fields.
  OSR_512: 0b00000000, // Over Sample Rate 512: less noise, more power.
  OSR_256: 0b01000000,
  OSR_128: 0b10000000,
  OSR_64: 0b11000000 // Over Sample Rate 64: more noise, less power.
}
class QMC5883L extends I2cBase {
  constructor (options = {}) {
    options.group = 'SENSOR'
    options.i2cAddress = 0x0d
    super(options, registers)
    this._vCalibration = [...Array(3)].map(x => Array(2).fill(0))
    this._vRaw = [...Array(3)].fill(0)
    this._calibrationUse = false
    this.temperature = 0
    this.init()
  }

  init () {
    this._writeByte(this.REG_RST_PERIOD, 0x01)
    // this.setMode(this.MODE_CONT, this.ODR_200HZ, this.RNG_8G, this.MODE_STBY)
    this.setMode(this.MODE_CONT, this.ODR_200HZ, this.RNG_8G, this.OSR_512)
  }

  setMode (mode, odr, rng, osr) {
    this._writeByte(this.REG_CONTROL_1, mode | odr | rng | osr)
  }

  reset () {
    this._writeByte(this.REG_CONTROL_2, 0x80)
  }

  setCalibration (xMin, xMax, yMin, yMax, zMin, zMax) {
    this._calibrationUse = true

    this._vCalibration[0][0] = xMin
    this._vCalibration[0][1] = xMax
    this._vCalibration[1][0] = yMin
    this._vCalibration[1][1] = yMax
    this._vCalibration[2][0] = zMin
    this._vCalibration[2][1] = zMax
  }

  _applyCalibration () {
    const xOffset = (this._vCalibration[0][0] + this._vCalibration[0][1]) / 2
    const yOffset = (this._vCalibration[1][0] + this._vCalibration[1][1]) / 2
    const zOffset = (this._vCalibration[2][0] + this._vCalibration[2][1]) / 2
    const xAvgDelta = (this._vCalibration[0][1] - this._vCalibration[0][0]) / 2
    const yAvgDelta = (this._vCalibration[1][1] - this._vCalibration[1][0]) / 2
    const zAvgDelta = (this._vCalibration[2][1] - this._vCalibration[2][0]) / 2

    const avgDelta = (xAvgDelta + yAvgDelta + zAvgDelta) / 3

    const xScale = avgDelta / xAvgDelta
    const yScale = avgDelta / yAvgDelta
    const zScale = avgDelta / zAvgDelta

    this._vCalibrated[0] = (this._vRaw[0] - xOffset) * xScale
    this._vCalibrated[1] = (this._vRaw[1] - yOffset) * yScale
    this._vCalibrated[2] = (this._vRaw[2] - zOffset) * zScale
  }

  read () {
    // this._vRaw[0] = this._readWord2c(this.REG_XOUT_LSB, true)
    // this._vRaw[1] = this._readWord2c(this.REG_YOUT_LSB, true)
    // this._vRaw[2] = this._readWord2c(this.REG_ZOUT_LSB, true)
    // this.temperature = this._readWord2c(this.REG_TOUT_LSB, true) / 100

    this._vRaw[0] = this._readLH(this.REG_XOUT_LSB)
    this._vRaw[1] = this._readLH(this.REG_YOUT_LSB)
    this._vRaw[2] = this._readLH(this.REG_ZOUT_LSB)
    this.temperature = this._readLH(this.REG_TOUT_LSB) / 100

    if (this._calibrationUse) {
      this._applyCalibration()
    }

    this.heading = Math.floor(this.getAzimuth())
  }

  getHeading () {
    this.read()
    return this.heading
  }

  getX () {
    return this._get(0)
  }

  getY () {
    return this._get(1)
  }

  getZ () {
    return this._get(2)
  }

  _get (i) {
    if (this._calibrationUse) {
      return this._vCalibrated[i]
    }

    return this._vRaw[i]
  }

  getAzimuth () {
    const a = 90 - Math.atan2(this.getY(), this.getX()) * 180.0 / Math.PI
    return a < 0 ? 360 + a : a > 359 ? a - 360 : a
  }

  getBearing (azimuth) {
    const a = azimuth / 22.5
    const r = a - Math.floor(a)
    return r >= 0.5 ? Math.ceil(a) : Math.floor(a)
  }
}

module.exports = QMC5883L
