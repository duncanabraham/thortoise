const i2cBase = require('./i2cBase')
const registers = require('./QMC5883L_Registers')
const { Triplet } = require('../triplet')
const { delay } = require('../utils')

const defaults = {
  address: registers.DFLT_ADDRESS,
  outputDataRate: this.ODR_10HZ,
  outputRange: this.RNG_2G,
  oversamplingRate: this.OSR_512
}
/**
 * QMC5883L is a 3 axis magnetometer with onboard temperature sensor.
 * https://datasheetspdf.com/pdf-file/1309218/QST/QMC5883L/1
 */
class QMC5883L extends i2cBase {
  constructor (options = {}) {
    super({ ...defaults, ...options }, registers)
    this._declination = 0.0
    this._calibration = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]]
    this.chipId = this._readByte(this.REG_CHIP_ID)
    if (this.chipId !== 0xff) {
      console.log(`Chip ID returned ${this.chipId.toString(16)} instead of 0xff; is the wrong chip?`)
    }
    this._init()
  }

  _init () {
    this.modeCont = (this.MODE_CONT | this.outputDataRate | this.outputRange | this.oversamplingRate)
    this.modeStby = (this.MODE_STBY | this.ODR_10HZ | this.RNG_2G | this.OSR_64)
    this.values = new Triplet(0, 0, 0)
    this.Temperature = 0
    this.mode_continuous()
  }

  modeContinuous () {
    this._writeByte(this.REG_CONTROL_2, this.SOFT_RST)
    this._writeByte(this.REG_CONTROL_2, this.INT_ENB)
    this._writeByte(this.REG_RST_PERIOD, 0x01)
    this._writeByte(this.REG_CONTROL_1, this.modeCont)
  }

  modeStandby () {
    this._write_byte(this.REG_CONTROL_2, this.SOFT_RST)
    this._write_byte(this.REG_CONTROL_2, this.INT_ENB)
    this._write_byte(this.REG_RST_PERIOD, 0x01)
    this._write_byte(this.REG_CONTROL_1, this.modeStby)
  }

  async getData () {
    let i = 0
    let x, y, z, t
    while (i < 20) {
      const status = this._readByte(this.REG_STATUS_1)
      if (status & this.STAT_OVL) {
        let msg = ('Magnetic sensor overflow.')
        if (this.outputRange === this.RNG_2G) {
          msg += ' Consider switching to RNG_8G output range.'
        }
        console.log(msg)
      }
      if (status & this.STAT_DOR) {
        x = this._readWord2c(this.REG_XOUT_LSB, true)
        y = this._readWord2c(this.REG_YOUT_LSB, true)
        z = this._readWord2c(this.REG_ZOUT_LSB, true)
        this.values.import(x, y, z)
        continue
      }
      if (status & this.STAT_DRDY) {
        x = this._readWord2c(this.REG_XOUT_LSB, true)
        y = this._readWord2c(this.REG_YOUT_LSB, true)
        z = this._readWord2c(this.REG_ZOUT_LSB, true)
        t = this._readWord2c(this.REG_TOUT_LSB, true)
        this.values.import(x, y, z)
        this.Temperature = t / 100
        break
      } else {
        await delay(10)
        i += 1
      }
      return this.values
    }
  }

  getMagnetRaw () {
    this.getData()
    return this.values
  }

  getMagnet () {
    this.getMagnetRaw()
    let result
    if (this.values.equals(new Triplet(0, 0, 0))) {
      result = [this.values.t1, this.values.t2]
    } else {
      const c = this._calibration
      const x1 = this.values.t1 * c[0][0] + this.values.t2 * c[0][1] + c[0][2]
      const y1 = this.values.t1 * c[1][0] + this.values.t2 * c[1][1] + c[1][2]
      result = [x1, y1]
    }
    return result
  }

  getBearingRaw () {
    this.getMagnetRaw()
    if (this.values.equals(new Triplet(0, 0, 0))) {
      return null
    } else {
      let b = this.values.toDeg(Math.atan2(this.values.t2, this.values.t1))
      if (b < 0) { b += 360.0 }
      return b
    }
  }

  getBearing () {
    this.getMagnet()
    if (this.values.equals(new Triplet(0, 0, 0))) {
      return null
    } else {
      let b = this.values.toDeg(Math.atan2(this.values.t2, this.values.t1))
      if (b < 0) { b += 360.0 }
      b += this._declination
      if (b < 0) { b += 360 } else if (b >= 360) { b -= 360.0 }
      return b
    }
  }

  getTemp () {
    this.getData()
    return this.Temperature
  }

  setDecliation (d) {
    try {
      if (d < -180.0 || d > 180.0) {
        console.log('Declination must be >= -180 and <= 180.')
      } else {
        this._declination = d
      }
    } catch (e) {
      console.log(`Declination must be a float value. ${e}`)
    }
  }

  getDeclination () {
    return this._declination
  }

  setCalibration (value) {
    const c = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]]
    try {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          c[i][j] = value[i][j]
        }
      }
      this._calibration = c
    } catch (e) {
      console.log('Calibration must be a 3x3 float matrix.', e)
    }
  }

  getCalibration () {
    return this._calibration
  }
}

module.exports = QMC5883L
