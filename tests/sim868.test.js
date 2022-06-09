/* global describe, it, beforeEach */
const SIM868 = require('../lib/SIM868')
const { expect } = require('chai')
const { delay } = require('../lib/utils')

describe('the SIM868 class', () => {
  let sim868
  beforeEach(() => {
    sim868 = new SIM868()
  })
  xit('Should return "ok" when the status command is called', async () => {
    sim868.status()
    await delay(500)
    expect(sim868.hasData()).to.equal(true)
    expect(sim868.getData()).to.equal('OK')
  })
  describe('when hasData() is called', () => {
    it('should return true if the SIM868 has data', () => {
      sim868._data = 'bob'
      const result = sim868.hasData()
      expect(result).to.equal(true)
    })
    it('should return false if the SIM868 has NO data', () => {
      sim868._data = null
      const result = sim868.hasData()
      expect(result).to.equal(false)
    })
  })
  describe('when getData() is called', () => {
    it('should return the value stored in _data', () => {
      sim868._data = 'bob'
      const result = sim868.getData()
      expect(result).to.equal('bob')
    })
    it('should remove the stored value once read', () => {
      sim868._data = 'bob'
      const result = sim868.getData()
      expect(sim868.hasData()).to.equal(false)
    })
  })
})
