/* global describe, it */
const Thortoise = require('../lib/thortoise')

const mockServoSettings = {
  range: [40, 90],
  startAt: 90,
  controller: 'PCA9685'
}

const counters = {
  makeServo: 0,
  exitHandler: 0,
  sweep: 0,
  to: 0
}

const mockDriver = {
  makeServo: () => {
    counters.makeServo++
    return {
      sweep: () => {
        counters.sweep++
      },
      to: () => {
        counters.to++
      }
    }
  },
  exitHandler: () => { 
    counters.exitHandler++
  }
}

const mockOptions = {
  name: 'testbot',
  version: 1,
  hipServo: mockServoSettings,
  femurServo: mockServoSettings,
  kneeServo: mockServoSettings,
  driver: mockDriver
}

const thort = new Thortoise(mockOptions)

describe('The Thortoise class: ', () => {
  describe('onn instantiation', () => {
    it('should initialise 4 legs', () => {

    })
    it('should add a grid', () => {})
    it('should set the start poisition on the grid', () => {})
    it('should define leg positions for each leg', () => {})
  })
})
