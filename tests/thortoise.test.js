/* global describe, it */
const { expect } = require('chai')
const Thortoise = require('../lib/thortoise')
const { mockDriver } = require('./mocks')
const Leg = require('../lib/leg')
const Navigation = require('../lib/navigation')

const mockServoSettings = {
  range: [40, 90],
  startAt: 90,
  controller: 'PCA9685'
}

const legDefaults = {
  femurLength: 150,
  tibiaLength: 150,
  hipServoSettings: this.hipServo,
  femurServoSettings: this.femurServo,
  kneeServoSettings: this.kneeServo,
  direction: 'forward'
}

const servos = {
  hipServoSettings: { range: [40, 90], startAt: 90, controller: 'PCA9685' },
  femurServoSettings: { range: [20, 120], startAt: 120, controller: 'PCA9685' },
  kneeServoSettings: { range: [40, 90], startAt: 90, controller: 'PCA9685' }
}

const mockOptions = {
  name: 'testbot',
  version: 1,
  driver: mockDriver,
  legSettings: [
    { id: 0, name: 'front-left', startPos: 0, ...legDefaults, ...servos },
    { id: 1, name: 'front-right', startPos: Math.PI / 2, ...legDefaults, ...servos },
    { id: 2, name: 'back-left', startPos: Math.PI, ...legDefaults, ...servos },
    { id: 3, name: 'back-right', startPos: Math.PI * 1.5, ...legDefaults, ...servos }
  ]
}

const thort = new Thortoise(mockOptions)

describe('The Thortoise class: ', () => {
  let thortoise
  let oldConsole = console
  after(()=>{
    console = oldConsole
  })
  beforeEach(() => {
    console = { 
      log: () => {},
      info: () => {}
    }
    thortoise = new Thortoise(mockOptions)
  })
  describe('on instantiation', () => {
    it('should initialise 4 legs as an array', () => {
      const { legs } = thortoise
      expect(legs).to.be.an('Array')
      expect(legs.length).to.equal(4)
      expect(legs[0]).to.be.an.instanceOf(Leg)
    })
    it('should add an instance of Navigation', () => {
      const { navigation } = thortoise
      expect(navigation).to.be.an.instanceOf(Navigation)
    })
    it('should define leg settings for each leg', () => {
      const { legSettings } = thortoise
      expect(legSettings).to.be.an('Array')
      expect(legSettings.length).to.equal(4)
    })
    it('should set the timer value to 20', () => {
      expect(thortoise.loopSpeedMS).to.equal(20)
    })
  })
  describe('when sleep() is called', () => {
    it('should set all legs to sleep mode', () => {})
    it('should call the stop method', () => {
      
    })
  })
  describe('when start() is called', () => {
    describe('when the bot is sleeping', () => {
      it('should come out of sleep mode', () => {
        thortoise.sleep()
        
      })
    })
    describe('when the bot is NOT sleeping', () => {
      xit('should start the running loop', () => {})
      it('should set up the handler on an interval timer', () => {
        oldSetInterval = setInterval
        const result = {}
        setInterval = (action, timer) => {
          result.action = action
          result.timer = timer
        }
        thortoise.start()
        setInterval = oldSetInterval
        const thortoiseLoopSpeedMS = 20
        expect(result.action).to.be.a('function')
        expect(result.action.name).to.equal('bound _runLoop')
        expect(result.timer).to.equal(thortoiseLoopSpeedMS)
      })
    })
  })
  describe('when stop() is called', () => {})
  describe('when kill() is called', () => {})
})
