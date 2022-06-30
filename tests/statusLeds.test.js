/* global describe, it, beforeEach, afterEach */
const { expect } = require('chai')

class MockStatus {
  constructor () {
    this._status = 0
  }

  setVoltageLevel = (n) => {
    n = (100 / 6.5) * n
    const minVal = 50
    this._status = 0
    for (let i = 0; i < 5; i++) {
      this._status |= n > minVal + (10 * i) ? 1 << i : 0
    }
  }
}

describe('the StatusLEDs class:', () => {
  describe('when setVoltageLevel() is called', () => {
    const status = new MockStatus()
    describe('and the level is less than 50%', () => {
      it('should set the status to zero', () => {
        status.setVoltageLevel(3)
        expect(status._status).to.equal(0)
      })
    })
    describe('and the level is more that 50% and less than 60%', () => {
      it('should set the status to 1', () => {
        status.setVoltageLevel(3.5)
        expect(status._status).to.equal(1)
      })
    })
    describe('and the level is more that 60% and less than 70%', () => {
      it('should set the status to 3', () => {
        status.setVoltageLevel(4)
        expect(status._status).to.equal(3)
      })
    })
    describe('and the level is more that 70% and less than 80%', () => {
      it('should set the status to 7', () => {
        status.setVoltageLevel(5)
        expect(status._status).to.equal(7)
      })
    })
    describe('and the level is more that 80% and less than 90%', () => {
      it('should set the status to 15', () => {
        status.setVoltageLevel(5.7)
        expect(status._status).to.equal(15)
      })
    })
    describe('and the level is more that 90%', () => {
      it('should set the status to 31', () => {
        status.setVoltageLevel(6.2)
        expect(status._status).to.equal(31)
      })
    })
  })
})
