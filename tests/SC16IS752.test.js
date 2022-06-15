/* global describe, it, beforeEach, arguments */
const { expect } = require('chai')
const mock = require('mock-require')
const path = require('path')

let calls = {}

const mockReadWriter = {
  readByteSync: () => { calls.readByteSync = arguments },
  writeByteSync: () => { calls.writeByteSync = arguments },
  closeSync: () => { calls.closeSync = 'called' }
}
const mockI2cBus = {
  openSync: () => {
    calls.openSync = 'called'
    return mockReadWriter
  }
}

describe('the SC16IS752 class', () => {
  let SC16IS752
  let extendedGpio
  beforeEach(() => {
    mock('i2c-bus', mockI2cBus)
    delete require.cache[path.join(__dirname, '../lib/SC16IS752.js')]
    SC16IS752 = require('../lib/SC16IS752')
    calls = {}
    extendedGpio = new SC16IS752()
  })
  describe('on instantiation', () => {
    it('should set the ioDir register to 0x0A', () => {
      expect(extendedGpio.ioDir).to.equal(0x0A)
    })
    it('should set the ioState register to 0x0B', () => {
      expect(extendedGpio.ioState).to.equal(0x0B)
    })
    it('should set the dirMask to 0000-0000', () => {
      expect(extendedGpio.dirMask).to.equal(0x00)
    })
    it('should call writeByteSync to store the dirMask in the ioDir register', () => {
      console.log('calls: ', calls)
    })
  })
})
