const { Triplet, QuadTrip } = require('./triplet')
const johnnyDriver = require('./johnnyDriver')
const Leg = require('./leg') // a bot has legs
const { Grid, coords } = require('./grid') // the world in which the bot lives
const Walk = require('./walk')

const driver = new johnnyDriver() // allows direct communication with the hardware
await driver.initBoard() // wait for the board to initialise before we use it

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
  constructor(options) {
    const gridWidth = options.gridWidth || 100
    const gridLength = options.gridLength || 300

    this.position = coords(gridWidth / 2, gridLength / 2)
    this.direction = 'forward'
    this.ticks = Math.PI / 90  // 2 PI radians in a circle, so PI/180 = 1 degree which is slow
    this.speedInMS = 500 // how long to perform each tick
    this.grid = new Grid(gridWidth, gridLength)

    Object.assign(this, options)
    this.init()

    const allLegPositions = new Triplet(this.hipServoSettings.startAt, this.femurServoSettings.startAt, this.kneeServoSettings.startAt)

    this.legPositions = new QuadTrip(allLegPositions, allLegPositions, allLegPositions, allLegPositions)
    this.walk = new Walk({
      legPositions: this.legPositions, 
      direction: this.direction,
      ticks: this.ticks,
      femurLength: 155,
      tibiaLength: 155
    })
  }

  init() {
    this.legs = [
      new Leg({ id: 0, name: 'front left', driver, hipServoSettings: this.hipServo, femurServoSettings: this.femurServo, kneeServoSettings: this.kneeServo }),
      new Leg({ id: 1, name: 'front right', driver, hipServoSettings: this.hipServo, femurServoSettings: this.femurServo, kneeServoSettings: this.kneeServo }),
      new Leg({ id: 2, name: 'back left', driver, hipServoSettings: this.hipServo, femurServoSettings: this.femurServo, kneeServoSettings: this.kneeServo }),
      new Leg({ id: 3, name: 'back right', driver, hipServoSettings: this.hipServo, femurServoSettings: this.femurServo, kneeServoSettings: this.kneeServo })
    ]
  }

  _setLegsToPosition() {
    const {t1, t2, t3, t4 } = this.legPositions
    this.legs[0].setAngles(t1, this.speedInMS)
    this.legs[1].setAngles(t2, this.speedInMS)
    this.legs[2].setAngles(t3, this.speedInMS)
    this.legs[3].setAngles(t4, this.speedInMS)
  }

  runLoop() {
    // Do this many times (10 default) per second (think Arduino!
    this._setLegsToPosition()
    this.legPositions = this.walk.nextStep()
  }

  start() {
    console.log('Starting main loop...')
    const loopSpeedMS = 1000 / 10 // 10 times per second

    const handler = this.runLoop.bind(this)
    this.running = setInterval(handler, loopSpeedMS)

    const exitHandler = () => {
      for (const leg of this.legs) {
        leg.stop()
      }
      console.log('Stopped')
    }
    this.board.on('exit', exitHandler.bind(this))
  }

  stop() {
    if (this.running) {
      clearInterval(this.running)
      delete this.running
    }
  }
}

module.exports = Thortoise
