require('./common')
const Controller = require('../lib/ServoController')
const servoController = new Controller()
const delay = require('../lib/utils').delay

const {options:{legSettings}} = require('../config')

const servoNames = ['hipServoSettings', 'femurServoSettings', 'kneeServoSettings']

const testLeg = 0
const testServo = 0

console.log('legSettings', legSettings[testLeg])
const servo = servoController.addServo(legSettings[testLeg][servoNames[testServo]])
console.log('servo: ', servo)

// Sweep the servo from 10 to maxRange and back to 10
const run = async () => {
  servo.stand()
}

run()
