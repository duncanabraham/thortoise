/* global describe, it */
const Thortoise = require('../lib/thortoise')
const { mockDriver } = require('./mocks')

const mockServoSettings = {
  range: [40, 90],
  startAt: 90,
  controller: 'PCA9685'
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
