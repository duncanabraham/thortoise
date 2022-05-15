const ServoDriver = require('./lib/servoDriver')
const Leg = require('./lib/leg')
const Servo = require('./lib/servo')
const Triplet = require('./lib/triplet')

const driver = new ServoDriver()

// Define the servos to form leg0
const servo0 = new Servo({ id: 0, name: 'hip0', debug: true }, driver)
const servo1 = new Servo({ id: 1, name: 'femur0', debug: false }, driver)
const servo2 = new Servo({ id: 2, name: 'knee0', debug: false }, driver)

// Define the servos to form leg1
// const servo3 = new Servo({ id: 3, name: 'hip1', debug: true })
// const servo4 = new Servo({ id: 4, name: 'femur1', debug: true })
// const servo5 = new Servo({ id: 5, name: 'knee1', debug: true })

// // Define the servos to form leg2
// const servo6 = new Servo({ id: 6, name: 'hip2', debug: true })
// const servo7 = new Servo({ id: 7, name: 'femur2', debug: true })
// const servo8 = new Servo({ id: 8, name: 'knee2', debug: true })

// // Define the servos to form leg3
// const servo9 = new Servo({ id: 9, name: 'hip3', debug: true })
// const servo10 = new Servo({ id: 10, name: 'femur3', debug: true })
// const servo11 = new Servo({ id: 11, name: 'knee3', debug: true })

// Configure the legs
const leg0 = new Leg({ hip: servo0, femur: servo1, knee: servo2 })
// const leg1 = new Leg({ hip: servo3, femur: servo4, knee: servo5 })
// const leg2 = new Leg({ hip: servo6, femur: servo7, knee: servo8 })
// const leg3 = new Leg({ hip: servo9, femur: servo10, knee: servo11 })

// console.log(leg0)
// console.log(leg1)
// console.log(leg2)
// console.log(leg3)

const pos0 = new Triplet(0, 1, 2)
const pos1 = new Triplet(1, 2, 1)
const pos2 = new Triplet(2, 0, 0)
const pos3 = new Triplet(1, 1, 1)
const pos4 = new Triplet(0, 2, 2)

const walk0 = [pos0, pos1, pos2, pos3, pos4, pos3, pos2, pos1]
// const walk1 = [pos1, pos2, pos3, pos4, pos3, pos2, pos1, pos0]
// const walk2 = [pos2, pos3, pos4, pos3, pos2, pos1, pos0, pos1]
// const walk3 = [pos1, pos2, pos3, pos4, pos3, pos2, pos1, pos0]

const left0 = [pos1, pos1, pos1, pos1, pos1, pos1, pos1, pos1]
// const left1 = [pos1, pos2, pos3, pos4, pos3, pos2, pos1, pos0]
// const left2 = [pos1, pos2, pos3, pos4, pos3, pos2, pos1, pos0]
// const left3 = [pos1, pos2, pos3, pos4, pos3, pos2, pos1, pos0]

const right0 = [pos1, pos2, pos3, pos4, pos3, pos2, pos1, pos0]
// const right1 = [pos1, pos1, pos1, pos1, pos1, pos1, pos1, pos1]
// const right2 = [pos1, pos2, pos3, pos4, pos3, pos2, pos1, pos0]
// const right3 = [pos1, pos2, pos3, pos4, pos3, pos2, pos1, pos0]


console.log(walk0)
// console.log(walk1)
// console.log(walk2)
// console.log(walk3)

let currentPos = 0

/**
 * Move each leg according to the walk sequence
 */
const walking = () => {
  leg0.setPosition(walk0[currentPos])
  // leg1.setPosition(walk1[currentPos])
  // leg2.setPosition(walk2[currentPos])
  // leg3.setPosition(walk3[currentPos])
  currentPos++
  if (currentPos === walk0.length) {
    currentPos = 0
  }
}

const walkingLoop = setInterval(walking, 1000) // Loop forever, run the walking routine every second

