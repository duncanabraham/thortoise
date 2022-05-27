const Leg = require('./leg')
const { Grid, coords } = require('./grid')
const { exec } = require('child_process')

class Thortoise {
  constructor (options) {
    const gridWidth = options.gridWidth || 100
    const gridLength = options.gridLength || 300

    this.position = coords(gridWidth / 2, gridLength / 2)
    this.direction = 'backward'
    this.action = ''

    this.steps = 72
    this.loopSpeedMS = 1000 / 50 // 50 times per second (Servos run at 50Hz by default)

    this.grid = new Grid(gridWidth, gridLength)
    this.step = 0

    Object.assign(this, options)

    this.driver.exitHandler(this.exitHandler.bind(this))

    this.init()
  }

  exitHandler () {
    for (const leg of this.legs) {
      leg.stop()
    }
    console.info('Stopped')
  }

  init () {
    this.legs = this.legSettings.map(thisLeg => new Leg({ ...thisLeg, driver: this.driver, steps: this.steps }))
    this._homeAllLegs()
  }

  _homeAllLegs () {
    this.legs.forEach(l => l.home())
  }

  /**
   * increment the step counter
   */
  _tock () {
    this.step += 1
    if (this.step === this.steps) { this.step = 0 }
  }

  _checkActions () {
    if (this.action.length) {
      console.log('Action request: ', this.action)
      switch (this.action) {
        case 'right':
        case 'left':
        case 'backward':
        case 'forward':
          this.direction = this.action
          break
        case 'sleep':
        case 'start':
        case 'stop':
        case 'kill':
          this[this.action]()
          break
      }
      this.action = ''
    }
  }

  // Main loop, this runs continuously
  _runLoop () {
    this._checkActions()
    switch (this.direction) {
      case 'backward':
      case 'forward':
        this.legs.forEach(l => l.setDirection(this.direction))
        break
      case 'left':
        this.legs[0].setDirection('forward')
        this.legs[1].setDirection('backward')
        this.legs[2].setDirection('forward')
        this.legs[3].setDirection('backward')
        break
      case 'right':
        this.legs[0].setDirection('backward')
        this.legs[1].setDirection('forward')
        this.legs[2].setDirection('backward')
        this.legs[3].setDirection('forward')
        break
    }
    this.legs.forEach(l => l.nextStep(this.step))
    const l0 = this.legs[0]
    const l1 = this.legs[1]
    const l2 = this.legs[2]
    const l3 = this.legs[3]

    // Output the kinematic values for all legs
    if (this.verbose && l0.newAngles && l0.newAngles.t1) {
      console.log(`${l0.newAngles.t1},${l0.newAngles.t2},${l0.newAngles.t3},${l1.newAngles.t1},${l1.newAngles.t2},${l1.newAngles.t3},${l2.newAngles.t1},${l2.newAngles.t2},${l2.newAngles.t3},${l3.newAngles.t1},${l3.newAngles.t2},${l3.newAngles.t3}`)
    }
    this._tock()
  }

  _sleepLoop () {
    this._checkActions()
  }

  async sleep () {
    const actions = this.legs.map(leg => leg.sleep())
    await Promise.all(actions)
    this.stop()
  }

  start () {
    if (this.sleeping) {
      clearInterval(this.sleeping)
      delete this.sleeping
    }
    if (!this.running) {
      console.info('Starting main loop...')
      const handler = this._runLoop.bind(this)
      this.running = setInterval(handler, this.loopSpeedMS) // check every loopSpeedMS (50 times/sec) to see if there's an action and perform required outcomes
    }
  }

  stop () {
    if (this.running) {
      clearInterval(this.running)
      delete this.running
    }
    if (!this.sleeping) {
      console.info('Starting sleep loop...')
      const handler = this._sleepLoop.bind(this)
      this.sleeping = setInterval(handler, 1000) // check every second to see if there's a command
    }
  }

  async kill () {
    await this.sleep()
    console.log('Shutting down now')
    exec('shutdown -h now', (error, out) => {
      if (error) {
        console.log(`error: ${error.message}`)
      }
      console.log(`stdout: ${out}`)
    })
  }
}

module.exports = Thortoise
