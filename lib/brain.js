const { CommandQueue } = require('./command')
const Navigation = require('./navigation')
const Camera = require('./camera')
const SIM868 = require('./SIM868')
const DepthAI = require('./depthai')
const { config: navigationSettings } = require('../config')

/* The Brain class is the main class that will determine what to do, how to do it and what commands
need to be added to the commandQueue */
class Brain {
  constructor (options) {
    Object.assign(this, options)
    this.camera = new Camera(options.cameraSettings)
    this.gps = new SIM868({ store: options.store })
    this.DepthAI = new DepthAI({ redisClient: options.redisClient, store: options.store })
    this.navigation = new Navigation(navigationSettings)
    this.commandQueue = new CommandQueue()
    this.commands = []

    this.gps.status()
  }

  tick () {
    if (this.gps.hasData) { // Check the
      const data = this.gps.data
      console.log('this data: ', data)
    }
  }
}

module.exports = Brain
