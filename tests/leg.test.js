/* global describe, it */
const { Triplet } = require('../lib/triplet')
const { expect } = require('chai')
const Leg = require('../lib/leg')

const { mockDriver, counters } = require('./mocks')

const servoSettings = {
  range: [40, 90],
  startAt: 90
}

describe('The Leg class: ', () => {
  let leg
  let legSettings
  beforeEach(() => {
    legSettings = {
      id: 3,
      name: 'test leg',
      driver: mockDriver,
      hipServoSettings: servoSettings,
      femurServoSettings: servoSettings,
      kneeServoSettings: servoSettings
    }
    leg = new Leg(legSettings)
  })
  it('should return an instance of the Leg class', () => {
    expect(leg).to.be.an.instanceOf(Leg)
  })
  it('should set the leg id from the settings', () => {
    expect(leg.id).to.equal(legSettings.id)
  })
  it('should set the baseId to 3 times the id', () => {
    expect(leg.baseId).to.equal(legSettings.id * 3)
  })
  it('should set the name from the settings', () => {
    expect(leg.name).to.equal('test leg')
  })
  it('should have a collection of 3 servos', () => {
    const servos = Object.keys(leg.servos)
    expect(servos.length).to.equal(3)
  })
  describe('the servos:', () => {
    it('should have a pin number based on the leg id', () => {
      expect(leg.servos.hip.pin).to.equal(leg.baseId + 0)
      expect(leg.servos.femur.pin).to.equal(leg.baseId + 1)
      expect(leg.servos.knee.pin).to.equal(leg.baseId + 2)
    })
    it('when stop is called, each servo\'s stop method is called', () => {
      leg.stop()
      counters.stopCount = 0
      leg.stop()
      expect(counters.stopCount).to.equal(3)
    })
    it('should reset the servos when "home" is called', () => {
      const position = new Triplet(10, 20, 30)
      const expectedPosition = new Triplet(90, 90, 90)
      leg.home()
      expect(leg.position.equals(expectedPosition)).to.equal(true)
    })
  })
})
