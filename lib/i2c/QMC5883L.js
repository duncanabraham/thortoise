const I2cBase = require('./i2cBase')
const { Triplet } = require('../triplet')
const { coords } = require('../grid')
const { delay } = require('../utils')

const registers = {
  i2cAddress: 0x0d,

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

const calibrationMax = new Triplet(2000, 2000, 2000)
const calibrationMin = new Triplet(0, 0, 0)

/**
 * Return a rounded number to n decimal places
 * @param {number} dec the number to adjust
 * @param {number} n how many decimal places to round to
 * @returns number
 */
const nDec = (dec, n) => {
  const m = Math.pow(10, n)
  return Math.round(dec * m) / m
}

const roundDeg = (deg) => {
  return deg < 0 ? deg + 360 : deg
}

class QMC5883L extends I2cBase {
  constructor (options) {
    super(options, registers)
    this.rawValues = new Triplet(0, 0, 0)
    this.adjustedValues = new Triplet(0, 0, 0)
    this.bearing = 0
    this.azimuth = 0
    this.temperature = 0
    this._init()
    this.running = setInterval(this._read.bind(this), 100)
  }

  _init () {
    this._reset()
    this._setMode(this.MODE_CONT, this.ODR_10HZ, this.RNG_8G, this.OSR_512)
  }

  _reset () {
    console.log('soft reset called')
    this._writeByte(this.REG_CONTROL_2, this.SOFT_RST)
  }

  _setMode (mode, odr, rng, osr) {
    const modeValue = mode | odr | rng | osr
    console.log('set mode: ', modeValue.toString(2))
    this._writeByte(this.REG_CONTROL_1, modeValue)
  }

  get _dataReady () {
    const status = this._readByte(this.REG_STATUS_1)
    if (status & this.STAT_OVL) {
      let msg = ('Magnetic sensor overflow.')
      if (this.outputRange === this.RNG_2G) {
        msg += ' Consider switching to RNG_8G output range.'
      }
      console.log(msg)
    }
    if (status & this.STAT_DOR) {
      this._init()
    }
    return (status & this.STAT_RDY) === this.STAT_RDY
  }

  async _read () {
    let timeout = 0
    while (!this._dataReady && timeout < 1000) {
      await delay(1)
      timeout++
    }
    if (timeout < 1000) {
      const x = this._readWord2c(this.REG_XOUT_LSB, true)
      const y = this._readWord2c(this.REG_YOUT_LSB, true)
      const z = this._readWord2c(this.REG_ZOUT_LSB, true)
      this.temperature = this._readWord2c(this.REG_TOUT_LSB, true) / 100
      this.rawValues.import(x, y, z)
      // this._calibrate()
    } else {
      this._init() // we didn't get data in 1 second so reset the sensor
    }
  }

  _azimuth () {
    // my dumb way of doing this
    // x is at 90 degrees to y, therefore x-y = 90
    const maxdeflection = Math.abs(this.rawValues.t1 - this.rawValues.t2) * 4 // 4 x 90 = 360, stay with me ...
    const xDeg = (this.rawValues.t1 / maxdeflection) * 360 // x is pointing to xDeg degrees
    const yDeg = (this.rawValues.t2 / maxdeflection) * 360 // y is pointing to yDeg degrees which is 90 degrees away from x
    const is90 = (xDeg - yDeg) === 90
    this.azimuth = is90 ? roundDeg(xDeg) : this.azimuth
    return this.azimuth
  }

  _calibrate () {
    // calibrate the sensor, and adjust if different to the expected values
    calibrationMin.minValues(this.rawValues)
    calibrationMax.maxValues(this.rawValues)

    const offsets = new Triplet((calibrationMin.t1 + calibrationMax.t1) / 2, (calibrationMin.t2 + calibrationMax.t2) / 2, (calibrationMin.t3 + calibrationMax.t3) / 2)
    const delta = new Triplet((calibrationMax.t1 - calibrationMin.t1) / 2, (calibrationMax.t2 - calibrationMin.t2) / 2, (calibrationMax.t3 - calibrationMin.t3) / 2)

    const avgDelta = (delta.t1 + delta.t2 + delta.t3) / 3

    const scale = new Triplet(avgDelta / delta.t1, avgDelta / delta.t2, avgDelta / delta.t3)

    const x = nDec((this.rawValues.t1 - offsets.t1) * scale.t1, 2)
    const y = nDec((this.rawValues.t2 - offsets.t2) * scale.t2, 2)
    const z = nDec((this.rawValues.t3 - offsets.t3) * scale.t3, 2)

    this.adjustedValues.import(x, y, z)
  }

  raw () {
    return this.rawValues
  }

  getBearing () {
    this.bearing = this._azimuth()
    return this.bearing
  }

  getTemperature () {
    return this.temperature
  }
}

module.exports = QMC5883L
