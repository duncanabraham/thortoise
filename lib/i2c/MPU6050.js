const i2cBase = require('./i2cBase')
const registers = require('./MPU6050_Registers')
const { Triplet } = require('../triplet')

class MPU6050 extends i2cBase {
  constructor (options = { i2cAddress: 0x68 }) {
    super({ ...options, group: 'SENSOR' }, registers)
    this.value = {}
    this.GRAVITIY_MS2 = 9.80665
    this.running = false
    this.calibrationOffsets = new Triplet()
    this.accelLookup = [
      { name: this.ACCEL_RANGE_2G, value: 2, modifier: this.ACCEL_SCALE_MODIFIER_2G },
      { name: this.ACCEL_RANGE_4G, value: 4, modifier: this.ACCEL_SCALE_MODIFIER_4G },
      { name: this.ACCEL_RANGE_8G, value: 8, modifier: this.ACCEL_SCALE_MODIFIER_8G },
      { name: this.ACCEL_RANGE_16G, value: 16, modifier: this.ACCEL_SCALE_MODIFIER_16G }
    ]
    this.gyroLookup = [
      { name: this.GYRO_RANGE_250DEG, value: 250, modifier: this.GYRO_SCALE_MODIFIER_250DEG },
      { name: this.GYRO_RANGE_500DEG, value: 500, modifier: this.GYRO_SCALE_MODIFIER_500DEG },
      { name: this.GYRO_RANGE_1000DEG, value: 1000, modifier: this.GYRO_SCALE_MODIFIER_1000DEG },
      { name: this.GYRO_RANGE_2000DEG, value: 2000, modifier: this.GYRO_SCALE_MODIFIER_2000DEG }
    ]
    this._init()
  }

  run () {
    this.running = setInterval(this.getAllData.bind(this), 100)
  }

  stop () {
    clearInterval(this.running)
    this.running = false
  }

  getValue () {
    return this.value
  }

  // Called automatically by the Feature instantiation
  _init () {
    this._writeByte(this.PWR_MGMT_1, 0x00)
  }

  getTemp () {
    const rawTemp = this._readHL(this.TEMP_OUT0)
    return ((rawTemp / 340.0) + 36.53) / 10
  }

  setAccelRange (range) {
    this._writeByte(this.ACCEL_CONFIG, 0x00)
    this._writeByte(this.ACCEL_CONFIG, range)
  }

  _getAccelRange () {
    const rawData = this._readByte(this.ACCEL_CONFIG) || this.ACCEL_RANGE_2G
    return this.accelLookup.find(item => item.name === rawData)
  }

  getAccelData (g = false) {
    const range = this._getAccelRange()

    const x = this._readHL(this.ACCEL_XOUT0) / range.modifier
    const y = this._readHL(this.ACCEL_YOUT0) / range.modifier
    const z = this._readHL(this.ACCEL_ZOUT0) / range.modifier

    return g ? new Triplet(x, y, z) : new Triplet(x * this.GRAVITIY_MS2, y * this.GRAVITIY_MS2, z * this.GRAVITIY_MS2)
  }

  setGyroRange (range) {
    this._writeByte(this.GYRO_CONFIG, 0x00)
    this._writeByte(this.GYRO_CONFIG, range)
  }

  setFilterRange (range) {
    const EXTSYNCSET = this._readByte(this.MPU_CONFIG) & 0b00111000
    this._writeByte(this.MPU_CONFIG, EXTSYNCSET | range)
  }

  _getGyroRange () {
    const rawData = this._readByte(this.GYRO_CONFIG) || this.GYRO_RANGE_250DEG
    return this.gyroLookup.find(item => item.name === rawData)
  }

  getGyroData () {
    const range = this._getGyroRange()

    const x = this._readHL(this.GYRO_XOUT0) / range.modifier
    const y = this._readHL(this.GYRO_YOUT0) / range.modifier
    const z = this._readHL(this.GYRO_ZOUT0) / range.modifier

    return new Triplet(x, y, z)
  }

  getAllData () {
    const a = this.getAccelData()
    this.value.temp = this.getTemp()
    this.value.accel = a
    this.value.gyro = this.getGyroData()
    this.value.roll = Math.atan2(a.y, a.z) * 180 / Math.PI
    this.value.pitch = Math.atan2(a.x, Math.sqrt(a.y * a.y + a.z * a.z)) * 180 / Math.PI
  }
}

module.exports = MPU6050
