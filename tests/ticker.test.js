/* global describe, beforeEach, it */
const Ticker = require('../lib/ticker')
const { expect } = require('chai')

describe('the Ticker class:', () => {
  let ticker
  beforeEach(() => {
    ticker = new Ticker(10)
  })
  describe('when tock() is called', () => {
    it('should increment the tick count', () => {
      const before = ticker._tick
      ticker.tock()
      expect(ticker._tick).to.equal(before + 1)
    })
  })
  describe('when the ticker exceeds the maximum', () => {
    it('should reset the counter to 0', () => {
      ticker._tick = 9
      ticker.tock()
      expect(ticker._tick).to.equal(0)
    })
  })
})
