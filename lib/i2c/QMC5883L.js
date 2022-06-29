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

const calibrationMax = new Triplet(0, 0, 0)
const calibrationMin = new Triplet(0, 0, 0)

const roundDeg = (deg) => {
  // the value should be between 0 and 359
  return deg < 0 ? deg + 360 : deg > 359 ? deg - 360 : deg
}

class Smooth {
  constructor () {
    this.list = [] // list of Triplets
  }

  add (value) {
    this.list.push(value)
    if (this.list.length > 10) {
      this.list.shift()
    }
  }

  avg () {
    const sum = new Triplet(0, 0, 0)
    for (let i = 0; i < this.list.length; i++) {
      sum.t1 += this.list[i].t1
      sum.t2 += this.list[i].t2
      sum.t3 += this.list[i].t3
    }
    return new Triplet(Math.floor(sum.t1 / this.list.length), Math.floor(sum.t2 / this.list.length), Math.floor(sum.t3 / this.list.length))
  }
}

class QMC5883L extends I2cBase {
  constructor (options) {
    super(options, registers)
    this.rawValues = new Triplet(0, 0, 0)
    this.smoothed = new Smooth()
    this.bearing = 0
    this.azimuth = 0
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
    while (!this._dataReady && timeout < 50) {
      await delay(1)
      timeout++
    }
    if (timeout < 50) {
      const x = this._readWord2c(this.REG_XOUT_LSB, true)
      const y = this._readWord2c(this.REG_YOUT_LSB, true)
      const z = this._readWord2c(this.REG_ZOUT_LSB, true)
      this.temperature = this._readWord2c(this.REG_TOUT_LSB, true) / 100
      this.rawValues.import(x, y, z)
      this.smoothed.add(this.rawValues)
      this._calibrate()
      this._azimuth()
    } else {
      this._init() // we didn't get data in 1 second so reset the sensor
    }
  }

  _calibrate () {
    // calibrate the sensor, and adjust if different to the expected values
    calibrationMin.minValues(this.rawValues)
    calibrationMax.maxValues(this.rawValues)
  }

  _azimuth () {
    // my dumb way of doing this
    // x is at 90 degrees to y, therefore x-y = 90
    // when x=90 we're pointing north
    // y is always to the left (west) of x unless we're upside down
    const maxDeflectionX = Math.abs(calibrationMax.t1 - calibrationMin.t1) * 4 // 4 x 90 = 360, stay with me ...
    const maxDeflectionY = Math.abs(calibrationMax.t2 - calibrationMin.t2) * 4
    const avg = this.smoothed.avg()
    const xDeg = roundDeg((avg.t1 / maxDeflectionX) * 360) // degrees as 90 == north
    const yDeg = roundDeg((avg.t2 / maxDeflectionY) * 360) // degrees as 270 == north

    this.upsideDown = (xDeg - yDeg) === -90 ? 1 : 0
    this.azimuth = roundDeg(xDeg)
    if (avg.t2 < 0) {
      this.azimuth = roundDeg(this.azimuth - 180)
    } else {
      this.azimuth = roundDeg(this.azimuth + 180)
    }
  }

  raw () {
    return this.rawValues
  }

  getBearing () {
    return roundDeg(this.azimuth - 90)
  }

  getTemperature () {
    return this.temperature
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
