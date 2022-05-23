const ServoDriver = require('./lib/servoDriver')
const Leg = require('./lib/leg')
const Servo = require('./lib/servo')
const { Triplet } = require('./lib/triplet')

const driver = new ServoDriver()

const ms = 1000

const mg996r = {
  maxRotation: 120,
  ms: 1000,
  steps: 0.02,
  minPos: 20,
  maxPos: 60
}

// Define the servos to form leg0
const servo0 = new Servo({ id: 0, name: 'hip0', debug: false, ...mg996r }, driver)
const servo1 = new Servo({ id: 1, name: 'femur0', debug: true, ...mg996r }, driver)
const servo2 = new Servo({ id: 2, name: 'knee0', debug: false, ...mg996r }, driver)

// Configure the legs
const leg0 = new Leg({ hip: servo0, femur: servo1, knee: servo2 })

const pos0 = new Triplet(0, 0, 0)
const pos1 = new Triplet(1, 1, 1)
const pos2 = new Triplet(2, 2, 2)
const pos3 = new Triplet(1, 1, 1)
const pos4 = new Triplet(2, 2, 2)
const pos5 = new Triplet(1, 1, 1)

const walk0 = [pos0, pos1, pos2, pos3, pos4, pos5]

let currentPos = 0

/**
 * Move each leg according to the walk sequence
 */
const walking = () => {
  leg0.setPosition(walk0[currentPos])
  currentPos++
  if (currentPos === walk0.length) {
    currentPos = 0
  }
}

const walkingLoop = setInterval(walking, ms) // Loop forever, run the walking routine every second
console.log(walkingLoop)
