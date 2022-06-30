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
    // Set some defaults
    this.direction = 'forward'
    this.currentAction = ''
    this.action = ''
    this.steps = 72
    this.loopSpeedMS = 1000 / 50 // 50 times per second (Servos run at 50Hz by default)
    this.step = 0
    // merge in the options
    Object.assign(this, options)
    this.brain = new Brain(options)
    this.heartbeat = setInterval(this.brain.tick.bind(this.brain), 10)
    this.driver.exitHandler(this.exitHandler.bind(this))
    this.init()
  }

  /**
   * If the object is sleeping, return 'sleeping', otherwise if it's running, return 'active',
   * otherwise return 'idle'
   * @returns The state of the thread.
   */
  get state () {
    return this.sleeping ? 'sleeping' : this.running ? 'active' : 'idle'
  }

  /**
   * It returns an object that is a copy of the bot object, but without the running, sleeping, driver,
   * store, and brain properties
   * @returns The exportObj is being returned.
   */
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
    this.legs.forEacg(leg => {
      leg.stop()
    })
    this.store.append('INFO', 'Stopped')
  }

  /**
   * It creates a new Leg object for each leg, and then deletes the legSettings and cameraSettings
   * variables
   */
  async init () {
    this.legs = this.legSettings.map(thisLeg => new Leg({ ...thisLeg, driver: this.driver, steps: this.steps }))
    // this.legs = []
    // this.legs.push(new Leg({ ...this.legSettings[0], driver: this.driver, steps: this.steps })) // front-left
    // this.legs.push(new Leg({ ...this.legSettings[1], driver: this.driver, steps: this.steps })) // front-right
    // this.legs.push(new Leg({ ...this.legSettings[2], driver: this.driver, steps: this.steps })) // back-left
    // this.legs.push(new Leg({ ...this.legSettings[3], driver: this.driver, steps: this.steps })) // back-right
    delete this.legSettings // we don't need them now
    delete this.cameraSettings
    this._homeAllLegs()
  }

  /**
   * _homeAllLegs() calls the home() function on each leg in the legs array
   */
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
            case 'test': // for unit testing
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
        this.stand()
      }
    }
  }

  /**
   * > If the direction is forward or backward, set all legs to that direction. If the direction is
   * left or right, set the legs to the opposite direction
   */
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
    // this._doMovement()
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
      this.isStanding = false
      this.store.append('INFO', 'Going to sleep')
      const actions = this.legs.map(leg => leg.sleep())
      await Promise.all(actions)
      const handler = this._sleepLoop.bind(this)
      this.sleeping = setInterval(handler, 1000)
    }
  }

  /**
   * "If the bot is not sleeping, and it's not already running, start the main loop."
   *
   * The main loop is the heart of the bot. It's the function that checks to see if there's an action
   * to perform, and if so, performs it
   */
  async start () {
    console.log('start')
    if (this.sleeping) {
      clearInterval(this.sleeping)
      delete this.sleeping
    }
    if (!this.running) {
      this.store.append('INFO', 'Starting main loop...')
      const handler = this._runLoop.bind(this)
      this.running = setInterval(handler, this.loopSpeedMS) // check every loopSpeedMS (50 times/sec) to see if there's an action and perform required outcomes
    }
    this._addImmediateAction('walk')
  }

  /**
   * If the bot is running, stop it. If it's not sleeping, start the sleep loop
   */
  async stop () {
    console.log('stop')
    if (this.running) {
      clearInterval(this.running)
      delete this.running
    }
    await this.stand()
  }

  /**
   * The `kill` function is called when the `thortoise` process is killed. It waits for the `sleep`
   * function to finish, then sends a `shutdown` command to the operating system
   */
  async kill () {
    console.log('kill')
    await this.sleep()

    clearInterval(this.heartbeat)
    delete this.heartbeat

    shutdown()
  }

  /**
   * all legs in a supportive position
   */
  async stand () {
    console.log('stand')
    if (!this.isStanding) {
      await this.legs.forEach(leg => leg.stand())
      this.isStanding = true
    }
  }

  async walk () {
    console.log('walk')
    if (!this.running) {
      await this.start()
    }
    // move in the current direction for n distance
  }

  /**
   * It adds an action to the command queue
   * @param action - The name of the action to be performed.
   * @param [other] - This is an object that can contain any other parameters you want to pass to the
   * command.
   */
  _addImmediateAction (action, other = {}) {
    this.action = new Command({ type: 'action', name: action, action, origin: 'machine', ...other })
    this.brain.commandQueue.addImmediateCommand(this.action)
  }

  /**
   * _addAction() adds a new action to the command queue
   * @param action - The name of the action to be performed.
   * @param [other] - This is an object that can contain any other parameters you want to pass to the
   * command.
   */
  _addAction (action, other = {}) {
    this.action = new Command({ type: 'action', name: action, action, origin: 'machine', ...other })
    this.brain.commandQueue.addCommand(this.action)
  }

  /**
   * set the current action to turn North
   */
  north () {
    console.log('turn north')
    this._addImmediateAction('turn', { notes: 'north' })
    this.turnDirection = this.brain.navigation.turnDirection(enums.NORTH)
    this.desiredBearing = enums.NORTH
  }

  /**
   * set the current action to turn East
   */
  east () {
    console.log('turn east')
    this._addImmediateAction('turn', { notes: 'east' })
    this.turnDirection = this.brain.navigation.turnDirection(enums.EAST)
    this.desiredBearing = enums.EAST
  }

  /**
   * set the current action to turn South
   */
  south () {
    console.log('turn south')
    this._addImmediateAction('turn', { notes: 'south' })
    this.turnDirection = this.brain.navigation.turnDirection(enums.SOUTH)
    this.desiredBearing = enums.SOUTH
  }

  /**
   * set the current action to turn West
   */
  west () {
    console.log('turn west')
    this._addImmediateAction('turn', { notes: 'west' })
    this.turnDirection = this.brain.navigation.turnDirection(enums.WEST)
    this.desiredBearing = enums.WEST
  }

  /**
   * make a turn and continue to turn until the desired bearing is reached
   * @param {INT} bearing where to turn to
   */
  turn (command) {
    let bearing
    if ('bearing' in command) { bearing = command.bearing }
    if (!bearing && 'coords' in command) {
      const point = coords(command.coords.x, command.coords.y)
      bearing = this.brain.navigation.currentPosition.bearingTo(point)
    }
    console.log(`turn ${bearing | this.desiredBearing}`)
    if (this.desiredBearing === undefined && bearing) {
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
      this._addImmediateAction('turn', { notes: `turning2 ${this.direction} ${this.turnDirection}` }) // keep on turning
    }
  }

  /**
   * "If you're not where you want to be, go there."
   *
   * The function takes two arguments: whereYouAre and whereYouAreNot
   * @param whereYouAre - the current location of the player
   * @param whereYouAreNot - the location of the nearest enemy <-- hahaha AI documentation engine thinks we're taking on the enemy
   */
  _goWhereYouAreNot (whereYouAre, whereYouAreNot) { // TODO: // there needs to be more to this
    // we need to move
    this._addImmediateAction('forward')
    // turn to face the correct direction
    if (whereYouAreNot.y < whereYouAre.y) { // north
      this._addImmediateAction('north')
    }
    if (whereYouAreNot.y > whereYouAre.y) { // south
      this._addImmediateAction('south')
    }
    if (whereYouAreNot.x > whereYouAre.x) { // east
      this._addImmediateAction('east')
    }
    if (whereYouAreNot.x < whereYouAre.x) { // west
      this._addImmediateAction('west')
    }
  }

  /**
   * If the current position is not the destination, then find the next place to go and go there
   * @param action - {
   * @returns A boolean value.
   */
  goto (action) {
    const { coords: destination } = action
    const destinationCoords = coords(destination.x, destination.y)
    const currentPosition = this.brain.navigation.currentPosition
    console.log(destinationCoords, currentPosition)
    if (!destinationCoords.equals(currentPosition)) {
      const result = this.brain.navigation.solve(currentPosition, destinationCoords) // result[0] is the next place to goto
      if (result && result.length > 0) {
        this._goWhereYouAreNot(currentPosition, result[0], action)
        this._addImmediateAction('goto', action) // keep trying to get there
        this._addImmediateAction('walk')
      } else {
        this._addAction('stop', { notes: `NO WAY TO GET TO ${this.destinationCoords}!!` })
      }
      return true
    } else {
      return false
    }
  }

  scan () {
    // use the AI camera to survey the land ahead and update the map.
    // commands may come from this
    this.brain.camera.getImage()
  }

  /**
   * The function saveWorld() is called when the user clicks the save button
   */
  saveWorld () {
    this.brain.saveWorld()
  }
}

module.exports = Thortoise
