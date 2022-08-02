require('./common')
const Controller = require('../lib/ServoController')
const servoController = new Controller()

const servo0Options = { name: 'frontLeftHip', range: [60, 70], startAt: 65, sleepAt: 65, standAt: 65 }

const servo0 = servoController.addServo({...servo0Options, pin: 0})
const servo1 = servoController.addServo({...servo0Options, pin: 1})
const servo2 = servoController.addServo({...servo0Options, pin: 2})

console.log('servo0', servo0.getPWM(0))
console.log('servo1', servo0.getPWM(1))
console.log('servo2', servo0.getPWM(2))
