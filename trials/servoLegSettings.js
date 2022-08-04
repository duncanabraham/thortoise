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

const servoNames = ['hipServoSettings', 'femurServoSettings', 'kneeServoSettings']

const testLeg = 0
const testServo = 0

const servo = servoController.addServo(servoConfig[testLeg][servoNames[testServo]])

// Sweep the servo from 10 to maxRange and back to 10
const run = async () => {
  servo.stand()
}

run()
