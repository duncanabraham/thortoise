const Leg = require('./leg') // a bot has legs
const { Grid, coords } = require('./grid') // the world in which the bot lives
const { legSettings } = require('../config')

class Thortoise {
  constructor(options) {
    const gridWidth = options.gridWidth || 100
    const gridLength = options.gridLength || 300

    this.position = coords(gridWidth / 2, gridLength / 2)
    this.direction = 'forward'
    this.steps = 72
    this.speedInMS = 1000
    this.grid = new Grid(gridWidth, gridLength)
    this.step = 0

    Object.assign(this, options)

    this.driver.exitHandler(this.exitHandler.bind(this))
    // console.log('driver: ', this.driver)

    this.init() // pin some legs on this beasty
  }

  exitHandler() {
    for (const leg of this.legs) {
      leg.stop()
    }
    console.info('Stopped')
  }

  init() {
    this.legs = legSettings.map(thisLeg => new Leg({ ...thisLeg, driver: this.driver }))
    this._homeAllLegs()
  }

  _homeAllLegs() {
    this.legs.forEach(l => l.home())
  }

  _tock() {
    const d = this.direction === 'forward' ? 1 : -1
    this.step += d
    if (this.step < 0) { this.step = this.steps }
    if (this.step > this.steps) { this.step = 0 }
  }

  // Main loop, this runs continuously
  _runLoop() {
    this.legs.forEach(l => l.nextStep(this.step))
    const l0 = this.legs[0]
    const l1 = this.legs[1]
    const l2 = this.legs[2]
    const l3 = this.legs[3]

    console.log(`${l0.newAngles.t1},${l0.newAngles.t2},${l0.newAngles.t3},${l1.newAngles.t1},${l1.newAngles.t2},${l1.newAngles.t3},${l2.newAngles.t1},${l2.newAngles.t2},${l2.newAngles.t3},${l3.newAngles.t1},${l3.newAngles.t2},${l3.newAngles.t3}`)
    this._tock() // move the counter on
  }

  start() {
    console.info('Starting main loop...')
    const loopSpeedMS = this.speedInMS / 50 // 10 times per second
    const handler = this._runLoop.bind(this)
    this.running = setInterval(handler, loopSpeedMS)
  }

  stop() {
    if (this.running) {
      clearInterval(this.running)
      delete this.running
    }
  }
}

module.exports = Thortoise
