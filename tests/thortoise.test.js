/* global describe, it */
const { expect } = require('chai')
const Thortoise = require('../lib/thortoise')
const { mockDriver } = require('./mocks')
const Leg = require('../lib/leg')
const Brain = require('../lib/brain')

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

const mockBrain = {}

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
  before(() => {
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
    it('should add an instance of Brain', () => {
      const { brain } = thortoise
      thortoise.brain = mockBrain
      expect(brain).to.be.an.instanceOf(Brain)
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
  describe('when the state() getter is called', () => {
    it('should return the current state', () => {
      const result = thortoise.state
      expect(result).to.equal('active')
    })
  })
  describe('when the export() getter is called', () => {
    it('should return a cut down thortoise object', () => {
      const result = thortoise.export
      const expectedResult='{"direction":"forward","action":"","steps":72,"loopSpeedMS":20,"step":0,"name":"testbot","version":1,"heartbeat":true,"legs":[{"steps":72,"id":0,"name":"front-left","startPos":0,"femurLength":150,"tibiaLength":150,"hipServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"femurServoSettings":{"range":[20,120],"startAt":120,"controller":"PCA9685"},"kneeServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"direction":"forward","driver":{},"servos":{"hip":{"pin":0,"name":"hip0","range":[40,90],"startAt":90,"controller":"PCA9685"},"femur":{"pin":1,"name":"femur0","range":[20,120],"startAt":120,"controller":"PCA9685"},"knee":{"pin":2,"name":"knee0","range":[40,90],"startAt":90,"controller":"PCA9685"}},"baseId":0,"step":0,"position":{"t1":90,"t2":120,"t3":90,"name":"front-left","startPos":0,"distanceFromHipToFoot":0,"angleAtFemur":0,"angleAtKnee":0,"angleAtHip":0,"femurLength":150,"tibiaLength":150,"position":{"t1":55,"t2":55,"t3":-205},"groundClearance":-205,"footX":55,"footY":55}},{"steps":72,"id":1,"name":"front-right","startPos":1.5707963267948966,"femurLength":150,"tibiaLength":150,"hipServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"femurServoSettings":{"range":[20,120],"startAt":120,"controller":"PCA9685"},"kneeServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"direction":"forward","driver":{},"servos":{"hip":{"pin":3,"name":"hip3","range":[40,90],"startAt":90,"controller":"PCA9685"},"femur":{"pin":4,"name":"femur3","range":[20,120],"startAt":120,"controller":"PCA9685"},"knee":{"pin":5,"name":"knee3","range":[40,90],"startAt":90,"controller":"PCA9685"}},"baseId":3,"step":0,"position":{"t1":90,"t2":120,"t3":90,"name":"front-right","startPos":1.5707963267948966,"distanceFromHipToFoot":0,"angleAtFemur":0,"angleAtKnee":0,"angleAtHip":0,"femurLength":150,"tibiaLength":150,"position":{"t1":55,"t2":55,"t3":-205},"groundClearance":-205,"footX":55,"footY":55}},{"steps":72,"id":2,"name":"back-left","startPos":3.141592653589793,"femurLength":150,"tibiaLength":150,"hipServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"femurServoSettings":{"range":[20,120],"startAt":120,"controller":"PCA9685"},"kneeServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"direction":"forward","driver":{},"servos":{"hip":{"pin":6,"name":"hip6","range":[40,90],"startAt":90,"controller":"PCA9685"},"femur":{"pin":7,"name":"femur6","range":[20,120],"startAt":120,"controller":"PCA9685"},"knee":{"pin":8,"name":"knee6","range":[40,90],"startAt":90,"controller":"PCA9685"}},"baseId":6,"step":0,"position":{"t1":90,"t2":120,"t3":90,"name":"back-left","startPos":3.141592653589793,"distanceFromHipToFoot":0,"angleAtFemur":0,"angleAtKnee":0,"angleAtHip":0,"femurLength":150,"tibiaLength":150,"position":{"t1":55,"t2":55,"t3":-205},"groundClearance":-205,"footX":55,"footY":55}},{"steps":72,"id":3,"name":"back-right","startPos":4.71238898038469,"femurLength":150,"tibiaLength":150,"hipServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"femurServoSettings":{"range":[20,120],"startAt":120,"controller":"PCA9685"},"kneeServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"direction":"forward","driver":{},"servos":{"hip":{"pin":9,"name":"hip9","range":[40,90],"startAt":90,"controller":"PCA9685"},"femur":{"pin":10,"name":"femur9","range":[20,120],"startAt":120,"controller":"PCA9685"},"knee":{"pin":11,"name":"knee9","range":[40,90],"startAt":90,"controller":"PCA9685"}},"baseId":9,"step":0,"position":{"t1":90,"t2":120,"t3":90,"name":"back-right","startPos":4.71238898038469,"distanceFromHipToFoot":0,"angleAtFemur":0,"angleAtKnee":0,"angleAtHip":0,"femurLength":150,"tibiaLength":150,"position":{"t1":55,"t2":55,"t3":-205},"groundClearance":-205,"footX":55,"footY":55}}]}'
      expect(JSON.stringify(result)).to.equal(expectedResult)
    })
  })
  describe('when the _tock() method is called', () => {
    it('should increment the step counter', () => {
      thortoise._tock()
      expect(thortoise.step).to.equal(1)
    })
  })
})
