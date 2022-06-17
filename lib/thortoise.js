const Leg = require('./leg')
const Brain = require('./brain')
const { shutdown } = require('./runCommand')

/* The `Thortoise` class is the main class that controls the bot. It's responsible for checking the
command queue, and performing the required actions */
class Thortoise {
  constructor (options) {
    this.direction = 'forward'
    this.currentAction = ''
    this.action = ''
    this.steps = 72
    this.loopSpeedMS = 1000 / 50 // 50 times per second (Servos run at 50Hz by default)
    this.step = 0
    Object.assign(this, options)
    this.brain = new Brain(options)
    this.heartbeat = setInterval(this.brain.tick.bind(this.brain), 10)
    this.driver.exitHandler(this.exitHandler.bind(this))
    this.init()
  }

  get state () {
    return this.sleeping ? 'sleeping' : this.running ? 'active' : 'idle'
  }

  get export () {
    const exportObj = Object.assign({}, this)
    delete exportObj.running
    delete exportObj.sleeping
    delete exportObj.driver
    delete exportObj.store
    delete exportObj.brain
    delete exportObj.redisClient
    return exportObj
  }

  exitHandler () {
    for (const leg of this.legs) {
      leg.stop()
    }
    this.store.append('INFO', 'Stopped')
  }

  init () {
    // this.legs = this.legSettings.map(thisLeg => new Leg({ ...thisLeg, driver: this.driver, steps: this.steps }))
    const thisLeg = this.legSettings[0]
    this.legs = [new Leg({ ...thisLeg, driver: this.driver, steps: this.steps })]
    delete this.legSettings // we don't need them now
    delete this.cameraSettings
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

  /**
   * If there's a command in the queue, execute it. If there's no command in the queue, sleep
   */
  async _checkActions () {
    const { commandQueue } = this.brain
    const nextAction = commandQueue.nextHumanCommand() || commandQueue.nextCommand()
    if (nextAction && nextAction.name !== 'Do Nothing') {
      switch (nextAction.type) {
        case 'action':
          switch (nextAction.action) {
            // When given a direction the thortoise needs to turn to face that direction
            case 'north':
            case 'east':
            case 'south':
            case 'west':
            case 'walk': // Walk needs to work out where we are walking to using the current direction and the current bearing
            case 'goto': // Goto needs to provide coords then use navigation.solve() to work out the next position we're moving to
              break
          }
          break
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
      // We won't go to sleep if there is a current action like walk or turn
      if (!this.sleeping) {
        this.store.append('INFO', 'Nothing to do')
        this.sleep()
      }
    }
  }

  _doMovement () {
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
    // this.legs.forEach(l => l.nextStep(this.step))
    this.legs[0].nextStep(this.step)
  }

  /**
   * It outputs the kinematic values for all legs if the verbose flag is set
   */
  _verbose () {
    if (this.verbose && this.legs[0].newAngles && this.legs[0].newAngles.t1) {
      // Output the kinematic values for all legs
      let output = `${this.legs[0].newAngles.t1},${this.legs[0].newAngles.t2},${this.legs[0].newAngles.t3},`
      output += `${this.legs[1].newAngles.t1},${this.legs[1].newAngles.t2},${this.legs[1].newAngles.t3},`
      output += `${this.legs[2].newAngles.t1},${this.legs[2].newAngles.t2},${this.legs[2].newAngles.t3},`
      output += `${this.legs[3].newAngles.t1},${this.legs[3].newAngles.t2},${this.legs[3].newAngles.t3}`
      this.store.append('INFO', output)
    }
  }

  // Main loop, this runs continuously
  _runLoop () {
    this.brain.tick()
    this._checkActions()
    this._doMovement()
    this._verbose()
    this._tock()
  }

  _sleepLoop () {
    this._checkActions()
  }

  /**
   * It puts the robot to sleep.
   */
  async sleep () {
    if (!this.sleeping) {
      this.store.append('INFO', 'Going to sleep')
      const actions = this.legs.map(leg => leg.sleep())
      await Promise.all(actions)
      this.stop()
    }
  }

  /**
   * "If the bot is not sleeping, and it's not already running, start the main loop."
   *
   * The main loop is the heart of the bot. It's the function that checks to see if there's an action
   * to perform, and if so, performs it
   */
  async start () {
    if (this.sleeping) {
      clearInterval(this.sleeping)
      delete this.sleeping
    }
    if (!this.running) {
      this.store.append('INFO', 'Starting main loop...')
      const handler = this._runLoop.bind(this)
      this.running = setInterval(handler, this.loopSpeedMS) // check every loopSpeedMS (50 times/sec) to see if there's an action and perform required outcomes
    }
  }

  /**
   * If the bot is running, stop it. If it's not sleeping, start the sleep loop
   */
  async stop () {
    if (this.running) {
      clearInterval(this.running)
      delete this.running
    }
    if (!this.sleeping) {
      this.store.append('INFO', 'Starting sleep loop...')
      const handler = this._sleepLoop.bind(this)
      this.sleeping = setInterval(handler, 1000) // check every second to see if there's a command
    }
  }

  /**
   * > The `kill` function is called when the `thortoise` process is killed. It waits for the `sleep`
   * function to finish, then sends a `shutdown` command to the operating system
   */
  async kill () {
    await this.sleep()

    clearInterval(this.heartbeat)
    delete this.heartbeat

    shutdown()
  }

  async walk () {
    if (!this.running) {
      await this.start()
    }
  }

  saveWorld () {
    this.brain.saveWorld()
  }
}

module.exports = Thortoise
