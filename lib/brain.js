const { CommandQueue, Command } = require('./command')
const Navigation = require('./navigation')
const Camera = require('./camera')
const Gps = require('./gps')
const DepthAI = require('./depthai')
const { config: navigationSettings } = require('../config')

/* The Brain class is the main class that will determine what to do, how to do it and what commands
need to be added to the commandQueue */
class Brain {
  constructor(options) {
    Object.assign(this, options)
    this.camera = new Camera(options.cameraSettings)
    this.Gps = new Gps({ redisClient: options.redisClient, store: options.store })
    this.DepthAI = new DepthAI({ redisClient: options.redisClient, store: options.store })
    this.navigation = new Navigation(navigationSettings)
    this.commandQueue = new CommandQueue()
    this.commands = []
  }

  tick() {
    // TODO: this is called on the heartbeat timer
    // It will determine what to do, how to do it and what commands
    // need to be added to the commandQueue
  }

}

module.exports = Brain