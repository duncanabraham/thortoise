/* global describe, it, beforeEach */
const Registry = require('../lib/registry')
const { expect } = require('chai')

const mockFeature = {
  _id: '123',
  type: 'CORE',
  group: 'SYSTEM',
  resumeHandler: () => {},
  pauseHandler: () => {}
}

describe('the Registry class:', () => {
  let registry
  beforeEach(() => {
    registry = new Registry()
  })
  describe('the register method()', () => {
    it('should add an item to the regitry', () => {
      registry.register(mockFeature)
      // console.log(registry._registry)
      expect(registry._registry).to.haveOwnProperty('CORE')
      expect(registry._registry.CORE).to.haveOwnProperty('SYSTEM')
      expect(registry._registry.CORE.SYSTEM).to.haveOwnProperty('123')
    })
  })
})
