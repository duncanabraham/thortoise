/* global describe, it, beforeEach */
const { expect } = require('chai')
const Brain = require('../lib/brain')

global.registry = {
  register: () => {}
}

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
    it('should add desiredBearing and set it to 270', () => {
      expect('desiredBearing' in brain).to.equal(true)
      expect(brain.desiredBearing).to.equal(270)
    })
    it('should get the actualBearing', () => {
      expect('actualBearing' in brain).to.equal(true)
    })
  })
})
