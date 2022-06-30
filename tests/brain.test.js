/* global describe, it, beforeEach */
const { expect } = require('chai')
const Brain = require('../lib/brain')

describe('the Brain class', () => {
  let brain
  beforeEach(() => {
    brain = new Brain()
  })
  describe('on instantiation', () => {
    it('should add a camera', () => {
      expect('camera' in brain).to.equal(true)
    })
    it('should add navigation', () => {
      expect('navigation' in brain).to.equal(true)
    })
    it('should add a commandQueue', () => {
      expect('commandQueue' in brain).to.equal(true)
    })
    it('should add an empty command array', () => {
      expect('commands' in brain).to.equal(true)
      expect(Array.isArray(brain.commands)).to.equal(true)
    })
    it('should add tickCount and set to 0', () => {
      expect('tickCount' in brain).to.equal(true)
    })
    it('should add desiredBearing and set it to 270', () => {
      expect('desiredBearing' in brain).to.equal(true)
      expect(brain.desiredBearing).to.equal(270)
    })
    it('should get the actualBearing', () => {
      expect('actualBearing' in brain).to.equal(true)
    })
  })
  describe('when tick() is called', () => {
    describe('when the tickCount is 0', () => {})
    describe('when the tickCount is 1', () => {})
    describe('when the tickCount is 2', () => {})
    describe('when the tickCount is 3', () => {})
    describe('when the tickCount is 4', () => {})
    describe('when the tickCount is 5', () => {})
    describe('when the tickCount is 6', () => {})
    describe('when the tickCount is 7', () => {})
    describe('when the tickCount is 8', () => {})
    describe('when the tickCount is 9', () => {})
    it('should increment the tick counter when called', () => {
      const originalValue = brain.tickCount.tick
      brain.tick()
      const newValue = brain.tickCount.tick
      expect(newValue).to.equal(originalValue + 1)
    })
  })
})
