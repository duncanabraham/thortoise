/* global describe, it */
const { expect } = require('chai')
const utils = require('../lib/utils')

describe('the utils library', () => {
  describe('the pad method', () => {
    describe('when called with the reverse flag', () => {
      it('should add spaces to the end of the string', () => {
        const result = utils.pad('123', 5, true)
        expect(result).to.equal('123  ')
      })
    })
    describe('when called without the reverse flag', () => {
      it('should add spaces to the start of the string', () => {
        const result = utils.pad('123', 5, false)
        expect(result).to.equal('  123')
      })
    })
  })
  describe('the delay method', () => {
    it('should wait n ms', async () => {
      const n = 5
      const startTime = new Date().getTime()
      await utils.delay(n)
      const endTime = new Date().getTime()
      expect(endTime - startTime).to.be.oneOf([n, n + 1]) // it takes a fraction of a second to run the `new Date()` command
    })
  })
  describe('the niceDate method', () => {
    it('should convert a zulu date to a date string', () => {
      const testDate = new Date('2022-03-02T09:08:07.123Z')
      const result = utils.niceDate(testDate)
      expect(result).to.equal('2022-03-02 09:08:07.123 GMT')
    })
  })
  describe('the easeInOutQuad method', () => {
    it('should perform a mathematical transformation', () => {
      const result = utils.easeInOutQuad(1, 2, 3, 4)
      expect(result).to.equal(2.375)
    })
    it('should perform a mathematical transformation', () => {
      const result = utils.easeInOutQuad(4, 3, 2, 1)
      expect(result).to.equal(-31)
    })
  })
  describe('the easeInOutCubic method', () => {
    it('should perform a mathematical transformation', () => {
      const result = utils.easeInOutCubic(1, 2, 3, 4)
      expect(result).to.equal(2.1875)
    })
    it('should perform a mathematical transformation', () => {
      const result = utils.easeInOutCubic(4, 3, 2, 1)
      expect(result).to.equal(221)
    })
  })
  describe('the easeOutCubic method', () => {
    it('should perform a mathematical transformation', () => {
      const result = utils.easeOutCubic(1, 2, 3, 4)
      expect(result).to.equal(3.734375)
    })
  })
  describe('the easeInCubic method', () => {
    it('should perform a mathematical transformation', () => {
      const result = utils.easeInCubic(1, 2, 3, 4)
      expect(result).to.equal(2.046875)
    })
  })
})
