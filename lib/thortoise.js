const Leg = require('./leg')
const Navigation = require('./navigation')
const Brain = require('./brain')
const { exec } = require('child_process')
const { config: navigationSettings } = require('../config')


class Thortoise {
  constructor(options) {
    this.direction = 'forward'
    this.action = ''
    this.steps = 72
    this.loopSpeedMS = 1000 / 50 // 50 times per second (Servos run at 50Hz by default)
    this.step = 0
    this.navigation = new Navigation(navigationSettings)
    this.brain = new Brain({})
    Object.assign(this, options)

    this.driver.exitHandler(this.exitHandler.bind(this))
    this.init()
  }

  get state() {
    return this.sleeping ? 'sleeping' : this.running ? 'active' : 'idle'
  }

  get export() {
    const exportObj = Object.assign({}, this)
    delete exportObj.running
    delete exportObj.sleeping
    delete exportObj.driver
    delete exportObj.navigation
    return exportObj
  }

  exitHandler() {
    for (const leg of this.legs) {
      leg.stop()
    }
    console.info('Stopped')
  }

  init() {
    this.legs = this.legSettings.map(thisLeg => new Leg({ ...thisLeg, driver: this.driver, steps: this.steps }))
    delete this.legSettings // we don't need them now
    this._homeAllLegs()
  }

  _homeAllLegs() {
    this.legs.forEach(l => l.home())
  }

  /**
   * increment the step counter
   */
  _tock() {
    this.step += 1
    if (this.step === this.steps) { this.step = 0 }
  }

  async _checkActions() {
    const { commandQueue } = this.brain
    const nextAction = commandQueue.nextHumanCommand() || commandQueue.nextCommand()
    if (nextAction && nextAction.name !== 'Do Nothing') {
      switch (nextAction.type) {
        case 'action':
        case 'move':
          switch (nextAction.action) {
            case 'right':
            case 'left':
            case 'backward':
            case 'forward':
              this.direction = nextAction.action
              break
            case 'sleep':
            case 'start':
            case 'stop':
            case 'kill':
              await this[nextAction.action]()
              break
          }
          break
      }
    } else {
      this.sleep()
    }
  }

  _doMovement() {
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
  }

  _verbose() {
    if (this.verbose && this.legs[0].newAngles && this.legs[0].newAngles.t1) {
      // Output the kinematic values for all legs
      let output = `${this.legs[0].newAngles.t1},${this.legs[0].newAngles.t2},${this.legs[0].newAngles.t3},`
      output += `${this.legs[1].newAngles.t1},${this.legs[1].newAngles.t2},${this.legs[1].newAngles.t3},`
      output += `${this.legs[2].newAngles.t1},${this.legs[2].newAngles.t2},${this.legs[2].newAngles.t3},`
      output += `${this.legs[3].newAngles.t1},${this.legs[3].newAngles.t2},${this.legs[3].newAngles.t3}`
      console.log(output)
    }
  }

  // Main loop, this runs continuously
  _runLoop() {
    this.brain.tick()
    this._checkActions()
    this._doMovement()
    this._verbose()
    this._tock()
  }

  _sleepLoop() {
    this._checkActions()
  }

  async sleep() {
    if (!this.sleeping) {
      console.log('going to sleep')
      const actions = this.legs.map(leg => leg.sleep())
      await Promise.all(actions)
      this.stop()
    }
  }

  async start() {
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

  async stop() {
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

  async kill() {
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
