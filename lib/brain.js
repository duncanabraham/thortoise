const { CommandQueue, Command } = require('./command')
const Camera = require('./camera')
const Gps = require('./gps')
const DepthAI = require('./depthai')
const { cameraSettings } = require('../config')

class Brain {
  constructor(options) {
    Object.assign(this, options)
    this.camera = new Camera(cameraSettings)
    this.Gps = new Gps({ redisClient: options.redisClient, store: options.store })
    this.DepthAI = new DepthAI({ redisClient: options.redisClient, store: options.store })
    this.commandQueue = new CommandQueue()
    this.commands = []
  }

  tick() {
    // TODO: this needs to be called on the heartbeat timer
    // It will determine what to do, how to do it and what commands
    // need to be added to the commandQueue
  }

}

module.exports = Brain
