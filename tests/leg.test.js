/* global describe, it, beforeEach */
const { Triplet } = require('../lib/triplet')
const { expect } = require('chai')
const Leg = require('../lib/leg')

global.registry = {
  register: () => {}
}

const { mockDriver, counters } = require('./mocks')

const servoSettings = {
  range: [40, 90],
  startAt: 45
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
      kneeServoSettings: servoSettings,
      startPos: 0,
      distanceFromHipToFoot: 0,
      angleAtFemur: 0,
      angleAtKnee: 0,
      angleAtHip: 0,
      femurLength: 110,
      tibiaLength: 110
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
  describe('setDirection()', () => {
    it('should allow the direction to be set', () => {
      leg.setDirection('testdirection')
      expect(leg.direction).to.equal('testdirection')
    })
  })
  describe('getDirection()', () => {
    describe('after instantiation', () => {
      it('should get the direction which will be undefined', () => {
        const direction = leg.getDirection()
        expect(direction).to.equal(undefined)
      })
    })
    describe('after being set to a value', () => {
      it('should return the value that has been set', () => {
        const setValue = 'FORWARD'
        leg.setDirection(setValue)
        const direction = leg.getDirection()
        expect(direction).to.equal(setValue)
      })
    })
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
      const expectedPosition = new Triplet(45, 45, 45)
      leg.home()
      expect(leg.position.equals(expectedPosition)).to.equal(true)
    })
    describe('min()', () => {
      const calls = {}
      function mockMin () {
        calls[this.name] = {
          minCalled: true
        }
      }
      beforeEach(() => {
        Object.keys(leg.servos).forEach(servo => {
          leg.servos[servo].min = mockMin.bind(leg.servos[servo])
        })
      })
      it('should call the min function on each servo', () => {
        leg.min()
        const expectedResult = {
          hip9: { minCalled: true },
          femur9: { minCalled: true },
          knee9: { minCalled: true }
        }
        expect(calls).to.deep.equal(expectedResult)
      })
    })
    describe('max()', () => {
      const calls = {}
      function mockMax () {
        calls[this.name] = {
          maxCalled: true
        }
      }
      beforeEach(() => {
        Object.keys(leg.servos).forEach(servo => {
          leg.servos[servo].max = mockMax.bind(leg.servos[servo])
        })
      })
      it('should call the min function on each servo', () => {
        leg.max()
        const expectedResult = {
          hip9: { maxCalled: true },
          femur9: { maxCalled: true },
          knee9: { maxCalled: true }
        }
        expect(calls).to.deep.equal(expectedResult)
      })
    })
    describe('directionFromStep()', () => {
      describe('when step is NOT set', () => {
        it('should set step to the value passed in', () => {
          leg.directionFromStep(2)
          expect(leg.step).to.equal(2)
        })
      })
      describe('when step is set', () => {
        beforeEach(() => {
          leg.step = 10
        })
        it('should set use the existing value', () => {
          leg.directionFromStep(2)
          expect(leg.step).to.equal(10)
        })
      })
      describe('when the direction is "forward"', () => {
        beforeEach(() => {
          leg.setDirection('forward')
        })
        it('should increment the step by 1', () => {
          leg.directionFromStep(2)
          expect(leg.step).to.equal(3)
        })
        describe('and the forward value exceeds the maximum steps', () => {
          it('should set the step to 0', () => {
            leg.directionFromStep(leg.steps)
            expect(leg.step).to.equal(0)
          })
        })
      })
      describe('when the direction is "backward"', () => {
        beforeEach(() => {
          leg.setDirection('backward')
        })
        it('should decrement the step by 1', () => {
          leg.directionFromStep(2)
          expect(leg.step).to.equal(1)
        })
        describe('and the step count is less than zero', () => {
          it('should set the step count to the maximum step value', () => {
            leg.directionFromStep(0)
            expect(leg.step).to.equal(leg.steps - 1)
          })
        })
      })
    })
    describe('the nextStep() method', () => {
      describe('when the direction is "forward"', () => {
        it('should increment the legs internal step position', () => {
          leg.setDirection('forward')
          leg.step = 1
          const nextStepPosition = 1
          leg.nextStep(nextStepPosition)
          expect(leg.step).to.equal(2)
        })
      })
      describe('when the direction is "backward"', () => {
        it('should decrement the legs internal step position', () => {
          leg.setDirection('backward')
          leg.step = 10
          const nextStepPosition = 1
          leg.nextStep(nextStepPosition)
          expect(leg.step).to.equal(9)
        })
      })
    })
  })
})
