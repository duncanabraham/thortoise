/* global describe, it */
require('./common')
const { expect } = require('chai')
const I2CBase = require('../lib/i2c/i2cBase')

const i2c = new I2CBase({ i2cAddress: 0x40 })

describe('The I2CBase Class', () => {
  describe('the _writeWordLH() method', () => {
    it('should swap the low and high bytes', () => {
      const value = 0xABCD
      const result = i2c._writeWordLH(1, value)
      expect(result.value).to.equal('CDAB')
    })
  })
})
