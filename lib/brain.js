const { CommandQueue } = require('./command')
const Navigation = require('./navigation')
const Camera = require('./camera')
const DepthAI = require('./depthai')
const { config: navigationSettings } = require('../config')

/* The Brain class is the main class that will determine what to do, how to do it and what commands
need to be added to the commandQueue */
class Brain {
  constructor (options) {
    Object.assign(this, options)
    this.camera = new Camera(options.cameraSettings)
    this.DepthAI = new DepthAI({ redisClient: options.redisClient, store: options.store })
    this.navigation = new Navigation(navigationSettings)
    this.commandQueue = new CommandQueue()
    this.commands = []
  }

  tick () {
  // TODO: things to do on a heartbeat timer ...
  }
}

module.exports = Brain
