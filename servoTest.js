const Servo = require('./lib/servo')
const ServoDriver = require('./lib/servoDriver')

const driver = new ServoDriver()

// Define settings for this specific servo
const mg996rServo = {
  ms: 1000,
  steps: 0.02,
  minPos: 0,
  maxPos: 60
}

const delay = (ms = 1000) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const testServo = new Servo({ id: 2, name: 'Test Servo', ...mg996rServo }, driver)

const run = async () => {
  testServo.setPosition(0)
  await delay()
  testServo.setPosition(1)
  await delay()
  testServo.setPosition(2)
  await delay()
  process.exit()
}

run()
