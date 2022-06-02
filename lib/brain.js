const { CommandQueue, Command } = require('./command')

class Brain {
  constructor(options) {
    Object.assign(this, options)
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
