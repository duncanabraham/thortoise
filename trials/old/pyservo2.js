require('../common')
const Controller = require('../../lib/ServoController')
const servoController = new Controller()
const delay = require('../../lib/utils').delay

const servo0Options = { pin: 0, name: 'frontLeftHip', range: [10, 170], startAt: 65, sleepAt: 65, standAt: 65 }
const servo = servoController.addServo(servo0Options)

// Sweep the servo from 10 to maxRange and back to 10
const run = async () => {
  let angle = 10
  let direction = 1
  const maxPos = servo0Options.range[1]
  while (true) {
    // servoController.setCount(0, pulse)
    servo.to(angle)
    await delay(10)
    direction = angle + direction >= maxPos || angle + direction <= 10 ? -direction : direction
    angle = angle + direction
  }
}

run()
