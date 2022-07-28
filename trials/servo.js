require('./common')
const ServoController = require('../lib/ServoController')
const servoController = new ServoController()
const servo0Options = { pin: 0, name: 'servo0', range: [60, 70], startAt: 65, sleepAt: 65, standAt: 65 }
const servo = servoController.addServo(servo0Options)

console.log(servoController)
console.log(servo)
servo.min()
servo.max()
servo.home()

