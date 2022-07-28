require('./common')
const ServoController = require('../lib/ServoController')
const servoController = new ServoController()
const servo = servoController.addServo({ pin: 0, name: 'servo0', startAt: 0, range: [0, 180] })
// servoController.to(0, 180)

console.log(servoController)