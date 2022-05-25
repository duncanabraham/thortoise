const Leg = require('./leg') // a bot has legs
const { Grid, coords } = require('./grid') // the world in which the bot lives

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
    this.direction = 'forward'
    this.ticks = 36
    this.speedInMS = 1000 // how long to perform each tick
    this.grid = new Grid(gridWidth, gridLength)
    this.tick = 0

    Object.assign(this, options)

    this.driver.exitHandler(this.exitHandler.bind(this))

    this.init() // pin some legs on this beasty
  }

  exitHandler () {
    for (const leg of this.legs) {
      leg.stop()
    }
    console.info('Stopped')
  }

  init () {
    const legConfig = {
      femurLength: 100,
      tibiaLength: 100,
      driver: this.driver,
      hipServoSettings: this.hipServo,
      femurServoSettings: this.femurServo,
      kneeServoSettings: this.kneeServo
    }
    // Create a representation of the physical legs
    this.legs = [
      new Leg({ ...legConfig, id: 0, name: 'front-left', startPos: 0 }),
      new Leg({ ...legConfig, id: 1, name: 'front-right', startPos: Math.PI / 2 }),
      new Leg({ ...legConfig, id: 2, name: 'back-left', startPos: Math.PI }),
      new Leg({ ...legConfig, id: 3, name: 'back-right', startPos: Math.PI * 1.5 })
    ]
    this._homeAllLegs()
  }

  _homeAllLegs () {
    this.legs.forEach(l => l.home())
  }

  _tock () {
    const d = this.direction === 'forward' ? 1 : -1
    this.tick += d
    if (this.tick < 0) { this.tick = this.ticks }
    if (this.tick > this.ticks) { this.tick = 0 }
  }

  // Main loop, this runs continuously
  _runLoop () {
    this.legs.forEach(l => l.nextStep(this.direction, this.tick))
    this._tock() // move the counter on
  }

  start () {
    console.info('Starting main loop...')
    const loopSpeedMS = this.speedInMS / 1 // 10 times per second
    const handler = this._runLoop.bind(this)
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
