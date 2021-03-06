const I2cBase = require('./i2cBase')
const { Triplet } = require('../triplet')
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

// Initial calibration values have been worked out by calibrating the sensor with the trials/compass.js file
const calibrationMax = new Triplet(3593, 2082, 3328)
const calibrationMin = new Triplet(0, -1027, 0)

class Smooth {
  constructor (length = 10) {
    this.list = [] // list of Triplets
    this.length = length
  }

  add (value) {
    this.list.push(value)
    if (this.list.length > this.length) {
      this.list.shift()
    }
  }

  avg () {
    const sum = new Triplet(0, 0, 0)
    for (let i = 0; i < this.list.length; i++) {
      sum.x += this.list[i].x
      sum.y += this.list[i].y
      sum.z += this.list[i].z
    }
    return new Triplet(Math.floor(sum.x / this.list.length), Math.floor(sum.y / this.list.length), Math.floor(sum.z / this.list.length))
  }
}

class QMC5883L extends I2cBase {
  constructor (options) {
    options.group = 'SENSOR'
    super(options, registers)
    this.rawValues = new Triplet(0, 0, 0)
    this.smoothed = new Smooth(50)
    this.bearing = 0
    this.azimuth = 0
    this._heading = 0
    this.temperature = 0
    this._init()
    this.running = setInterval(this._read.bind(this), 20)
    this.upsideDown = 0
  }

  _init () {
    this._reset()
    this._setMode(this.MODE_CONT, this.ODR_50HZ, this.RNG_8G, this.OSR_512)
  }

  _reset () {
    // console.log('soft reset called')
    this._writeByte(this.REG_CONTROL_2, this.SOFT_RST)
  }

  _setMode (mode, odr, rng, osr) {
    const modeValue = mode | odr | rng | osr
    // console.log('set mode: ', modeValue.toString(2))
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
    while (!this._dataReady && timeout < 50) {
      await delay(1)
      timeout++
    }
    if (timeout < 50) {
      const x = this._toSignedInt(this._readLH(this.REG_XOUT_LSB))
      const y = this._toSignedInt(this._readLH(this.REG_YOUT_LSB))
      const z = this._toSignedInt(this._readLH(this.REG_ZOUT_LSB))
      this.temperature = this._toSignedInt(this._readLH(this.REG_TOUT_LSB)) / 100
      this.rawValues.import(x, y, z)
      this.smoothed.add(this.rawValues)
      this._calibrate()
    } else {
      this._init() // we didn't get data in 1 second so reset the sensor
    }
  }

  _calibrate () {
    // calibrate the sensor, and adjust if different to the expected values
    calibrationMin.minValues(this.rawValues)
    calibrationMax.maxValues(this.rawValues)
  }

  getHeading () {
    const angles = [-1, 1, 90, 45, 180, -2, 135, -3, 270, 315, -4, -5, 225, -6, -7, -8]
    const avg = this.smoothed.avg()
    const quartX = (calibrationMax.x - calibrationMin.x) * 0.33
    const quartY = (calibrationMax.y - calibrationMin.y) * 0.33
    const minX = calibrationMin.x
    const minY = calibrationMin.y
    const maxX = calibrationMax.x
    const maxY = calibrationMax.y
    this._heading = 0
    if (avg.x > maxX - quartX) {
      this._heading += 1 // North of the line
    } else if (avg.x < minX + quartX) {
      this._heading += 4 // South of the line
    }
    if (avg.y < minY + quartY) {
      this._heading += 8
    } else if (avg.y > maxY - quartY) {
      this._heading += 2
    }
    return this._heading > 0 ? angles[this._heading] : this._heading
  }

  raw () {
    return this.rawValues
  }

  getTemperature () {
    return this.temperature
  }

  getCalibration () {
    return {
      calibrationMax,
      calibrationMin
    }
  }

  /**
   * Save power by putting the compass to sleep
   */
  sleep () {
    this._reset()
  }

  wake () {
    this._init()
  }
}

module.exports = QMC5883L
