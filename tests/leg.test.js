const { Triplet } = require('../lib/triplet')
const { expect } = require('chai')
const Leg = require('../lib/leg')

const servoSettings = {
  range: [40, 90],
  pin: 0,
  startAt: 90
}

class mockServo {
  constructor(options) {
    Object.assign(this, options)
    this.stopCount = 0
    this.toValue = 0
  }

  stop() {
    this.stopCount++
  }

  to(pos){
    this.toValue = pos
  }
}

class mockDriver {
  makeServo(options) {
    return new mockServo(options)
  }
}

const legId = 3

describe('The Leg class: ', () => {
  let leg
  beforeEach(() => {
    leg = new Leg({ id: legId, name: 'test leg', driver: new mockDriver(), hipServoSettings: servoSettings, femurServoSettings: servoSettings, kneeServoSettings: servoSettings })
  })
  it('should return an instance of the Leg class', () => {
    expect(leg).to.be.an.instanceOf(Leg)
  })
  it('should set the leg id from the settings', () => {
    expect(leg.id).to.equal(legId)
  })
  it('should set the baseId to 3 times the id', () => {
    expect(leg.baseId).to.equal(legId * 3)
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
      const servos = Object.keys(leg.servos)
      expect(leg.servos.hip.id).to.equal(legId * 3 + 0)
      expect(leg.servos.femur.id).to.equal(legId * 3 + 1)
      expect(leg.servos.knee.id).to.equal(legId * 3 + 2)
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
