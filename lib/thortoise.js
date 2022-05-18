const Triplet = require('./triplet')
const ServoDriver = require('./servoDriver')
const Leg = require('./leg') // a bot has legs
const { Grid, coords } = require('./grid') // the world in which the bot lives

const driver = new ServoDriver() // allows direct communication with the hardware

/**
 * options:
 *    name: What is my name
 *    version: what version of the code am I running
 *    gridWidth: how wide is our world
 *    gridLength: how long is out world
 *    hipServo: what are the settings for the hip servo
 *    femurServo: what are the settings for the femur servo
 *    kneeServo: what are the settings for the knee servo
 */
class Thortoise {
  constructor (options) {
    const gridWidth = options.gridWidth || 100
    const gridLength = options.gridLength || 300

    this.position = coords(gridWidth / 2, gridLength / 2)

    this.grid = new Grid(gridWidth, gridLength)
    Object.assign(this, options)
    this.init()
  }

  init () {
    this.legs = [
      new Leg({ id: 0, name: 'front left', driver, hipServoSettings: this.hipServo, femurServoSettings: this.femurServo, kneeServoSettings: this.kneeServo }),
      new Leg({ id: 1, name: 'front right', driver, hipServoSettings: this.hipServo, femurServoSettings: this.femurServo, kneeServoSettings: this.kneeServo }),
      new Leg({ id: 2, name: 'back left', driver, hipServoSettings: this.hipServo, femurServoSettings: this.femurServo, kneeServoSettings: this.kneeServo }),
      new Leg({ id: 3, name: 'back right', driver, hipServoSettings: this.hipServo, femurServoSettings: this.femurServo, kneeServoSettings: this.kneeServo })
    ]
  }

  forward () {

  }

  reverse () {

  }

  right () {

  }

  left () {

  }

  runLoop () {
    // Do this many times per second (think Arduino!)
    if (this.startupSequence) {
      console.log('run once: ', this.legs)
      // initialise by turning all servos to minPos
      this.legs.forEach(leg => leg.setAngles(new Triplet(leg.hip.minPos, leg.femur.minPos, leg.knee.minPos)))
      this.startupSequence = false
    } else {
      // do whatever this bot does
    }
  }

  start () {
    console.log('Starting main loop...')
    const loopSpeedMS = 1000 / 100 // 100 times per second
    this.startupSequence = true
    const handler = this.runLoop.bind(this)
    this.running = setInterval(handler, loopSpeedMS)
  }

  stop () {
    if (this.running) {
      clearInterval(this.running)
      delete this.running
    }
  }
}

module.exports = Thortoise
