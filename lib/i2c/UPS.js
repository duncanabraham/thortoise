const i2cBase = require('./i2cBase')
const log = require('../log') // Change to actual path

const REG_CONFIG = 0x00
const REG_SHUNTVOLTAGE = 0x01
const REG_BUSVOLTAGE = 0x02
const REG_POWER = 0x03
const REG_CURRENT = 0x04
const REG_CALIBRATION = 0x05

const BusVoltageRange = {
  RANGE_16V: 0x00,
  RANGE_32V: 0x01
}

const ADCResolution = {
  ADCRES_9BIT_1S: 0x00,
  ADCRES_10BIT_1S: 0x01,
  ADCRES_11BIT_1S: 0x02,
  ADCRES_12BIT_1S: 0x03,
  ADCRES_12BIT_2S: 0x09,
  ADCRES_12BIT_4S: 0x0A,
  ADCRES_12BIT_8S: 0x0B,
  ADCRES_12BIT_16S: 0x0C,
  ADCRES_12BIT_32S: 0x0D,
  ADCRES_12BIT_64S: 0x0E,
  ADCRES_12BIT_128S: 0x0F
}


const Gain = {
  DIV_1_40MV: 0x00,
  DIV_2_80MV: 0x01,
  DIV_4_160MV: 0x02,
  DIV_8_320MV: 0x03
}

const Mode = {
  POWERDOWN: 0x00,
  SVOLT_TRIGGERED: 0x01,
  BVOLT_TRIGGERED: 0x02,
  SANDBVOLT_TRIGGERED: 0x03,
  ADCOFF: 0x04,
  SVOLT_CONTINUOUS: 0x05,
  BVOLT_CONTINUOUS: 0x06,
  SANDBVOLT_CONTINUOUS: 0x07
}

class UPS extends i2cBase {
  constructor(options = {}, additional = {}) {
    options.group = 'HAT'
    options.type = 'CORE'
    super(options, additional)
    this.data = null
    this._current_lsb = .1
    this._cal_value = 4096
    this._power_lsb = .002
    this.bus_voltage_range = BusVoltageRange.RANGE_32V
    this.gain = Gain.DIV_8_320MV
    this.bus_adc_resolution = ADCResolution.ADCRES_12BIT_32S
    this.shunt_adc_resolution = ADCResolution.ADCRES_12BIT_32S
    this.mode = Mode.SANDBVOLT_CONTINUOUS
    this.config = this.bus_voltage_range << 13 | this.gain << 11 | this.bus_adc_resolution << 7 | this.shunt_adc_resolution << 3 | this.mode
    this.init()
  }

  init() {
    try {
      this._writeWord(REG_CALIBRATION, this._cal_value)
      this._writeWord(REG_CONFIG, this.config)
    } catch (error) {
      log.error('Error during initialization:', error)
    }
  }

  async readData() {
    try {
      this._writeWord(REG_CALIBRATION, this._cal_value)
      const shuntVoltage = this._readWord(REG_SHUNTVOLTAGE)
      const busVoltage = this._readWord(REG_BUSVOLTAGE)
      const current = this._readWord(REG_CURRENT)
      const power = this._readWord(REG_POWER)
  
      const shuntVoltageV = shuntVoltage / 1000 // convert to V if needed
      const currentA = current / 1000 // convert to A
      const powerW = power // seems to be already in W
  
      const percent = ((busVoltage - 6) / 2.4) * 100
      const adjustedPercent = percent > 100 ? 100 : percent < 0 ? 0 : percent
  
      this.data = {
        shuntVoltage: shuntVoltageV,
        busVoltage,
        current: currentA,
        power: powerW,
        percent: adjustedPercent
      }
  
      console.log('read UPS data: ', this.data)
    } catch (error) {
      log.error('Error reading from INA219:', error)
      return null
    }
  }
}

module.exports = UPS

