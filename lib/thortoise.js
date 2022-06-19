const Leg = require('./leg')
const Brain = require('./brain')
const { shutdown } = require('./runCommand')
const enums = require('./enums')
const { Command } = require('./command')
const { coords } = require('../lib/grid')

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
    return exportObj
  }

  exitHandler () {
    for (const leg of this.legs) {
      leg.stop()
    }
    this.store.append('INFO', 'Stopped')
  }

  init () {
    this.legs = this.legSettings.map(thisLeg => new Leg({ ...thisLeg, driver: this.driver, steps: this.steps }))
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
            case 'north': // turn until the bearing is 0
            case 'east': // turn until the bearing is 90
            case 'south': // turn until the bearing is 180
            case 'west': // turn until the bearing is 270
            case 'walk': // Walk needs to work out where we are walking to using the current direction and the current bearing
            case 'goto': // Goto needs to provide coords then use navigation.solve() to work out the next position we're moving to
            case 'sleep': // stop everything and save power
            case 'start': // begin processing the next command
            case 'stop': // just stop
            case 'kill': // die and shutdown
            case 'scan': // have a look around, update the map
            case 'turn': // turn in the current direction
              this.store.append('INFO', `action ${nextAction.action} ${nextAction.notes}`)
              await this[nextAction.action](nextAction)
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
          }
          break
      }
    } else {
      // We won't go to sleep if there is a current action like walk or turn
      if (!this.sleeping) {
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
    this.legs.forEach(l => l.nextStep(this.step))
  }

  /**
   * It outputs the kinematic values for all legs if the verbose flag is set
   */
  _verbose () {
    if (this.verbose && this.legs[0].newAngles && this.legs[0].newAngles.t1) {
      // Output the kinematic values for all legs
      const output = {}
      this.legs.forEach(leg => {
        output[leg.name] = leg.newAngles
      })
      this.store.append('DATA', JSON.stringify(output))
    }
  }

  // Main loop, this runs continuously
  _runLoop () {
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
   * The `kill` function is called when the `thortoise` process is killed. It waits for the `sleep`
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
    // move in the current direction for n distance
  }

  _addImmediateAction (action, other = {}) {
    this.action = new Command({ type: 'action', name: action, action, origin: 'machine', ...other })
    this.brain.commandQueue.addImmediateCommand(this.action)
  }

  _addAction (action, other = {}) {
    this.action = new Command({ type: 'action', name: action, action, origin: 'machine', ...other })
    this.brain.commandQueue.addCommand(this.action)
  }

  /**
   * set the current action to turn North
   */
  north () {
    this._addImmediateAction('turn', { notes: 'north' })
    this.turnDirection = this.brain.navigation.turnDirection(enums.NORTH)
    this.desiredBearing = enums.NORTH
    console.log('this: ', this)
  }

  /**
   * set the current action to turn East
   */
  east () {
    this._addImmediateAction('turn', { notes: 'east' })
    this.turnDirection = this.brain.navigation.turnDirection(enums.EAST)
    this.desiredBearing = enums.EAST
  }

  /**
   * set the current action to turn South
   */
  south () {
    this._addImmediateAction('turn', { notes: 'south' })
    this.turnDirection = this.brain.navigation.turnDirection(enums.SOUTH)
    this.desiredBearing = enums.SOUTH
  }

  /**
   * set the current action to turn West
   */
  west () {
    this._addImmediateAction('turn', { notes: 'west' })
    this.turnDirection = this.brain.navigation.turnDirection(enums.WEST)
    this.desiredBearing = enums.WEST
  }

  /**
   * make a turn and continue to turn until the desired bearing is reached
   * @param {INT} bearing where to turn to
   */
  turn (bearing) {
    if (this.desiredBearing === undefined) {
      this.desiredBearing = bearing // allow arbitary value to be set
    }
    this.direction = ''
    if (this.turnDirection < 0) {
      this.direction = 'left'
    }
    if (this.turnDirection > 0) {
      this.direction = 'right'
    }
    if (this.brain.navigation.matchedBearing(this.desiredBearing)) {
      this.store.append('INFO', 'turn complete')
      this._addImmediateAction('scan', { notes: 'have a look around' })
    } else {
      this._addImmediateAction('turn', { notes: `turning ${this.direction} ${this.turnDirection}` }) // keep on turning
    }
  }

  _goWhereYouAreNot (whereYouAre, whereYouAreNot) { // TODO: // there needs to be more to this
    // we need to move
    this._addImmediateAction('forward')
    // turn to face the correct direction
    if (whereYouAreNot.y > whereYouAre.y) { // north
      this._addImmediateAction('north')
    } else if (whereYouAreNot.y < whereYouAre.y) { // south
      this._addImmediateAction('south')
    } else if (whereYouAreNot.x > whereYouAre.x) { // east
      this._addImmediateAction('east')
    } else if (whereYouAreNot.x < whereYouAre.x) { // west
      this._addImmediateAction('west')
    }
  }

  goto (action) {
    const { coords: destination } = action
    const destinationCoords = coords(destination.x, destination.y)
    const currentPosition = this.brain.navigation.currentPosition
    if (!destinationCoords.equals(currentPosition)) {
      const result = this.brain.navigation.solve(currentPosition, destinationCoords) // result[0] is the next place to goto
      this._goWhereYouAreNot(currentPosition, result[0], action)
      this._addImmediateAction('walk')
      this._addImmediateAction('goto', action) // keep trying to get there
    }
  }

  scan () {
    // use the AI camera to survey the land ahead and update the map.
    // commands may come from this
  }

  saveWorld () {
    this.brain.saveWorld()
  }
}

module.exports = Thortoise
