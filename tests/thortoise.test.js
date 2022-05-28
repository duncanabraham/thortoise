/* global describe, it */
const Thortoise = require('../lib/thortoise')
const { mockDriver } = require('./mocks')

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
  hipServo: mockServoSettings,
  femurServo: mockServoSettings,
  kneeServo: mockServoSettings,
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
  describe('on instantiation', () => {
    xit('should initialise 4 legs', () => {

    })
    xit('should add a grid', () => {})
    xit('should set the start poisition on the grid', () => {})
    xit('should define leg positions for each leg', () => {})
  })
})
