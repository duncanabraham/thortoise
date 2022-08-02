require('./common')
const Controller = require('../lib/ServoController')
const servoController = new Controller()

const servo0Options = { range: [60, 70], startAt: 65, sleepAt: 65, standAt: 65 }

const servo0 = servoController.addServo({...servo0Options, pin: 0, name: 'frontLeftHip'})
const servo1 = servoController.addServo({...servo0Options, pin: 1, name: 'frontLeftFemur'})
const servo2 = servoController.addServo({...servo0Options, pin: 2, name: 'frontLeftKnee'})

console.log('Controller: ', servoController)

console.log('servo0', servoController.getPWM(0))
console.log('servo1', servoController.getPWM(1))
console.log('servo2', servoController.getPWM(2))

servo0.stand()
