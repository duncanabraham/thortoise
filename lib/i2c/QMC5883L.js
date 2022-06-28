const I2cBase = require('./i2cBase')
const { Triplet } = require('../triplet')

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
  STAT_DRDY: 0b00000001, // Data Ready.
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
  constructor (options) {
    super(options, registers)
    this.rawValues = new Triplet(0, 0, 0)
    this._init()
  }

  _init () {
    this._writeByte(this.REG_RST_PERIOD, this.MODE_CONT)
    this.setMode(this.MODE_CONT, this.ODR_200HZ, this.RNG_8G, this.OSR_512)
  }

  setMode (mode, odr, rng, osr) {
    this._writeByte(this.REG_CONTROL_1, mode | odr | rng | osr)
  }

  read () {
    return new Promise((resolve, reject) => {
      this._readBytes(this.REG_XOUT_LSB, 6, (err, data) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          this.rawValues.t1 = data[0] | (data[1] << 8)
          this.rawValues.t2 = data[2] | (data[3] << 8)
          this.rawValues.t3 = data[4] | (data[5] << 8)
          resolve()
        }
      })
    })
  }

  getAzimuth () {
    const a = Math.atan2(this.rawValues.t2, this.rawValues.t1) * 180.0 / Math.PI
    return a < 0 ? 360 + a : a
  }

  getBearing (azimuth) {
    const a = azimuth / 22.5
    const r = a - Math.round(a)
    let sexdec = 0
    sexdec = (r >= 0.5) ? Math.ceil(a) : Math.floor(a)
    return sexdec
  }
}

module.exports = QMC5883L
