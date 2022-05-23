const { describe, it, beforeEach } = require('mocha')
const { Triplet } = require('../lib/triplet')
const { expect } = require('chai')
const Leg = require('../lib/leg')

const servoSettings = {
  range: [40, 90],
  pin: 0,
  startAt: 90
}

class MockServo {
  constructor (options) {
    Object.assign(this, options)
    this.stopCount = 0
    this.toValue = 0
  }

  stop () {
    this.stopCount++
  }

  to (pos) {
    this.toValue = pos
  }
}

class MockDriver {
  makeServo (options) {
    return new MockServo(options)
  }
}

describe('The Leg class: ', () => {
  let leg
  let legSettings
  beforeEach(() => {
    legSettings = {
      id: 3,
      name: 'test leg',
      driver: new MockDriver(),
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
    it('should have an id based on the leg id', () => {
      expect(leg.servos.hip.id).to.equal(legSettings.id * 3 + 0)
      expect(leg.servos.femur.id).to.equal(legSettings.id * 3 + 1)
      expect(leg.servos.knee.id).to.equal(legSettings.id * 3 + 2)
    })
    it('when stop is called, each servo\'s stop method is called', () => {
      leg.stop()
      Object.keys(leg.servos).forEach(key => {
        const servo = leg.servos[key]
        expect(servo.stopCount).to.equal(1)
      })
    })
    it('should set servo positions when setAngles is called', () => {
      const position = new Triplet(10, 20, 30)
      leg.setAngles(position)
      expect(leg.servos.hip.toValue).to.equal(10)
      expect(leg.servos.femur.toValue).to.equal(20)
      expect(leg.servos.knee.toValue).to.equal(30)
    })
    it('store the set position in the leg', () => {
      const position = new Triplet(10, 20, 30)
      leg.setAngles(position)
      expect(leg.position).to.equal(position)
    })
    it('should reset the servos when "home" is called', () => {
      const position = new Triplet(10, 20, 30)
      const expectedPosition = new Triplet(90, 90, 90)
      leg.setAngles(position)
      leg.home()
      expect(leg.position.equals(expectedPosition)).to.equal(true)
    })
  })
})
