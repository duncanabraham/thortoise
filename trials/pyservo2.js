require('./common')
const Controller = require('../lib/ServoController')
const servoController = new Controller()
const delay = require('../lib/utils').delay

const servo0Options = { pin: 0, name: 'frontLeftHip', range: [10, 170], startAt: 65, sleepAt: 65, standAt: 65 }

const servo = servoController.addServo(servo0Options)

const run = async () => {
  let pulse = 10
  while (true) {
    servoController.setCount(0, pulse)
    await delay(10)
    pulse = pulse + 1 > 170 ? 10 : pulse + 1
  }
}

run()
