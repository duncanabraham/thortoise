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

const cameraSettings = {
  mode: 'photo',
  output: `${__dirname}/image.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
}

const mockOptions = {
  name: 'testbot',
  version: 1,
  driver: mockDriver,
  cameraSettings,
  store: {
    append: () => { }
  },
  legSettings: [
    { id: 0, name: 'front-left', startPos: 0, ...legDefaults, ...servos },
    { id: 1, name: 'front-right', startPos: Math.PI / 2, ...legDefaults, ...servos },
    { id: 2, name: 'back-left', startPos: Math.PI, ...legDefaults, ...servos },
    { id: 3, name: 'back-right', startPos: Math.PI * 1.5, ...legDefaults, ...servos }
  ]
}

// const thort = new Thortoise(mockOptions)

describe('The Thortoise class: ', () => {
  let thortoise
  let oldConsole = console
  let setIntervalStore
  let result = {}
  before(() => {
    setIntervalStore = setInterval
    console = {
      log: () => { },
      info: () => { }
    }
    setInterval = (action, timer) => {
      result.action = action
      result.timer = timer
      return true
    }
  })
  after(() => {
    console = oldConsole
    setInterval = setIntervalStore
  })
  beforeEach(() => {
    result = {}
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
    it('should set the timer value to 20', () => {
      expect(thortoise.loopSpeedMS).to.equal(20)
    })
  })
  describe('when sleep() is called', () => {
    it('should set all legs to sleep mode', () => { })
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
      it('should start the running loop', () => {
        delete thortoise.running
        thortoise.start()
        console.log('thortoise: ', thortoise)
        expect(thortoise.running).to.equal(true)
      })
      it('should set up the handler on an interval timer', () => {
        thortoise.start()
        const thortoiseLoopSpeedMS = 20
        expect(result.action).to.be.a('function')
        expect(result.action.name).to.equal('bound _runLoop')
        expect(result.timer).to.equal(thortoiseLoopSpeedMS)
      })
    })
  })
  describe('when stop() is called', () => { })
  describe('when kill() is called', () => { })
})
