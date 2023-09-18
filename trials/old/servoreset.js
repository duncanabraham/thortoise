require('../common')
const Controller = require('../../lib/ServoController')
const servoController = new Controller()
const delay = require('../../lib/utils').delay

const servo0Options = { pin: 0, name: 'frontLeftHip', range: [10, 170], startAt: 65, sleepAt: 65, standAt: 65 }
const servo = servoController.addServo(servo0Options)

servo.stop()
