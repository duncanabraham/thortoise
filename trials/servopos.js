require('./common')
const Controller = require('../lib/ServoController')
const servoController = new Controller()

const { delay } = require('../lib/utils')

const servo0Options = { range: [0, 180], startAt: 90, sleepAt: 90, standAt: 90 }

const servo0 = servoController.addServo({...servo0Options, pin: 0, name: 'frontLeftHip'})

console.log('Controller: ', servoController)

servoController.setCount(0, 200)

console.log('servo0', servoController.getPWM(0))

delay(3000).then(()=>{
  servoController.shutdown() // PCA9685._stop()
})

