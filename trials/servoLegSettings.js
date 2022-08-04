require('./common')
const Controller = require('../lib/ServoController')
const servoController = new Controller()
const delay = require('../lib/utils').delay

const config = require('../config')

const servoConfig = [
  config.servosFrontLeft,
  config.servosFrontRight,
  config.servosBackLeft,
  config.servosBackRight
]

console.log('servoConfig: ', servoConfig)

const servoNames = ['hipServoSettings', 'femurServoSettings', 'kneeServoSettings']

const testLeg = 0
const testServo = 0

const servo = servoController.addServo(servoConfig[testLeg][servoNames[testServo]])
console.log('servo: ', servo)

// Sweep the servo from 10 to maxRange and back to 10
const run = async () => {
  servo.stand()
}

run()
