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

const delay = (ms = 3000) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const testServo = new Servo({ id: 2, name: 'Test Servo', ...mg996rServo }, driver) // id:2 is the knee joint

const run = async () => {
  console.log('1) ', new Date().toISOString())
  await testServo.setPosition(0)
  await delay()
  console.log('2) ', new Date().toISOString())
  await testServo.setPosition(1)
  await delay()
  console.log('3) ', new Date().toISOString())
  await testServo.setPosition(2)
  await delay()
  console.log('4) ', new Date().toISOString())
  process.exit()
}

run()
