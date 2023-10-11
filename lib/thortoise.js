const Brain = require('./brain')
const enums = require('./enums')
const { Command } = require('./command')
const { coords } = require('./grid')
const Ticker = require('./ticker')
const log = require('./log')

const Tracks = require('./tracks')

/*
The `Thortoise` class is the main class that controls the bot. It's responsible for checking the
command queue, and performing the required actions
*/
class Thortoise {
  constructor (options) {
    this.direction = 'forward'
    this.action = ''
    this.steps = 72
    this.tracks = new Tracks()
    this.loopSpeedMS = 1000 / 50 // 50 times per second
    Object.assign(this, { ...options }) // merge in the options
    this.brain = new Brain(options)
    delete this.redisClient
    this.heartbeat = setInterval(this.heartBeatTick.bind(this), 100) // call heartbeat 10 times per second
    this.counters = {
      ticker: new Ticker(10, { timer: 100, auto: false }), // general purpose counts to 10
      saver: new Ticker(1, { timer: 10000, auto: true, action: this.brain.navigation.odometry.send.bind(this.brain.navigation.odometry) }),
      // powerStatus: new Ticker({ timer: 30000, auto: true, action: this.powerManagement.bind(this) })
    }
    setInterval(this.powerManagement.bind(this), 30000);
    if (this.verbose) {
      console.log('System registry: ', global.registry.export())
    }
  }

  async powerManagement () {
    console.log('Checking Power Status')
    this.brain.sound('WOMP')
    await this.brain.ups.readData()
    
    // TODO: If power is low we need to sleep. If we're already sleeping and the power is low we need to send a message and power down
  }

  shutdown () {
    // try { this.tracks.stop() } catch (err) { console.error('Error stopping tracks:', err) }
    // try { this.brain.navigation.odometry.save() } catch (err) { console.error('Error saving odometry data:', err) }
    // try { this.brain.navigation.saveWorld() } catch (err) { console.error('Error saving world data:', err) }
  }

  async _onceEverySecond () {
    if (this.brain.navigation.gps.dataAvailable()) {
      console.log('Latest GPS Data:', this.brain.navigation.gps.getLatestData())
    }
  }

  async _twiceEverySecond () {

  }

  _fivePerSecond () { }

  _tenPerSecond () { }

  /**
   * Things to do on the heartbeat timer relating to the Thortoise, movement, hardware etc
   */
  heartBeatTick () {
    this.counters.ticker.tock()
    switch (this.counters.ticker.tick) {
      case 0:
        this._tenPerSecond()
        this._onceEverySecond()
        break
      case 1:
        this._tenPerSecond()
        this._twiceEverySecond()
        this._fivePerSecond()
        break
      case 2:
        this._tenPerSecond()
        break
      case 3:
        this._tenPerSecond()
        this._fivePerSecond()
        break
      case 4:
        this._tenPerSecond()
        break
      case 5:
        this._tenPerSecond()
        this._fivePerSecond()
        break
      case 6:
        this._tenPerSecond()
        this._twiceEverySecond()
        break
      case 7:
        this._tenPerSecond()
        this._fivePerSecond()
        break
      case 8:
        this._tenPerSecond()
        break
      case 9:
        this._tenPerSecond()
        this._fivePerSecond()
        break
    }
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
    const dontExportThese = ['brain', 'running', 'sleeping', 'store', 'counters', 'registry', 'heartbeat']
    dontExportThese.forEach(item => delete exportObj[item])
    exportObj.sensorValues = this.brain.sensorValues
    exportObj.navigationValues = this.brain.navigationValues
    if (this.verbose) {
      log.info(exportObj)
    }
    return exportObj
  }

  get sensors () {
    const exportObj = {
      sensorValues: this.brain.sensorValues,
      navigationValues: this.brain.navigationValues
    }
    if (this.verbose) {
      log.info(exportObj)
    }
    return exportObj
  }

  async exitHandler () {
    log.info('INFO', 'Stopped')
  }

  /**
   * It creates a new Track collection, and then deletes the trackSettings
   */
  async init () {
    await this.brain.init()
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
              log.info('INFO', `action ${nextAction.action} ${nextAction.notes || ''}`)
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
      // if (!this.sleeping) {}
    }
  }

  _doMovement () {
    // TODO: I think a command to move should contain a heading and either a distance or a duration in seconds
    // This _doMovement is very vague and without purpose.
    // Also, a speed would be good. We can go from -100% to +100% but where is that being passed the move command?
    if (this.brain.compass.hasData) { // only move if we know where we're going
      this.tracks.move(this.direction)
    }
  }

  // Main loop, this runs continuously
  _runLoop () {
    this._checkActions()
    // this._doMovement()
  }

  _sleepLoop () {
    this._checkActions()
  }

  /**
   * It puts the robot to sleep.
   */
  async sleep () {
    if (!this.sleeping) {
      log.info('INFO', 'Going to sleep')
      this.tracks.stop()
      const handler = this._sleepLoop.bind(this)
      this.sleeping = setInterval(handler, 1000) // only check for commands every second
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
      log.info(`Running in the ${this.env} Environment`)
      log.info('INFO', 'Starting main loop...')
      const handler = this._runLoop.bind(this)
      this.running = setInterval(handler, this.loopSpeedMS) // check every loopSpeedMS (50 times/sec) to see if there's an action and perform required outcomes
    }
    this._addImmediateAction('sleep')
  }

  /**
   * If the bot is running, stop it. If it's not sleeping, start the sleep loop
   */
  async stop () {
    if (this.verbose) {
      log.info('stop')
    }
    if (this.running) {
      clearInterval(this.running)
      delete this.running
      this.tracks.stop()
    }
  }

  /**
   * The `kill` function is called when the `thortoise` process is killed. It waits for the `sleep`
   * function to finish, then sends a `shutdown` command to the operating system
   */
  async kill () {
    if (this.verbose) {
      log.info('kill')
    }
    await this.sleep()

    clearInterval(this.heartbeat)
    delete this.heartbeat

    this.shutdown()
  }

  /**
   * Left over from the legged prototype this action just means move
   */
  async walk () {
    if (this.verbose) {
      log.info('walk')
    }
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
    if (this.verbose) {
      log.info('turn north')
    }
    this._addImmediateAction('turn', { notes: 'north' })
    this.turnDirection = this.brain.navigation.turnDirection(enums.NORTH)
    this.desiredBearing = enums.NORTH
  }

  /**
   * set the current action to turn East
   */
  east () {
    if (this.verbose) {
      log.info('turn east')
    }
    this._addImmediateAction('turn', { notes: 'east' })
    this.turnDirection = this.brain.navigation.turnDirection(enums.EAST)
    this.desiredBearing = enums.EAST
  }

  /**
   * set the current action to turn South
   */
  south () {
    if (this.verbose) {
      log.info('turn south')
    }
    this._addImmediateAction('turn', { notes: 'south' })
    this.turnDirection = this.brain.navigation.turnDirection(enums.SOUTH)
    this.desiredBearing = enums.SOUTH
  }

  /**
   * set the current action to turn West
   */
  west () {
    if (this.verbose) {
      log.info('turn west')
    }
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
      // const point = coords(command.coords.x, command.coords.y)
      bearing = this.brain.navigation.currentBearing()
    }
    log.info(`turn ${bearing} | ${this.desiredBearing}`)
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
      log.info('INFO', 'turn complete')
      this._addImmediateAction('scan', { notes: 'have a look around' })
    } else {
      this.tracks.move(this.direction) // turn left or right
      this._addImmediateAction('turn', { notes: `turning ${this.direction} ${this.turnDirection}` }) // keep on turning
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
    if (this.verbose) {
      log.info(destinationCoords, currentPosition)
    }
    if (!destinationCoords.equals(currentPosition)) {
      const result = this.brain.navigation.solve(currentPosition, destinationCoords) // result[0] is the next place to goto
      if (result && result.length > 0) {
        this._goWhereYouAreNot(currentPosition, result[0], action)
        this._addImmediateAction('goto', action) // keep trying to get there
        this._addImmediateAction('forward')
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
    this.brain.navigation.saveWorld()
  }
}

module.exports = Thortoise
