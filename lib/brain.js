const { CommandQueue } = require('./command')
const Navigation = require('./navigation')
const Camera = require('./camera')
const DepthAI = require('./depthai')
const LPS22HB = require('./LPS22HB')

const { config: navigationSettings } = require('../config')

/* The Brain class is the main class that will determine what to do, how to do it and what commands
need to be added to the commandQueue */
class Brain {
  constructor (options) {
    Object.assign(this, options)
    this.tempPressureReader = new LPS22HB(0x5C)
    this.camera = new Camera(options.cameraSettings)
    this.DepthAI = new DepthAI({ redisClient: options.redisClient, store: options.store })
    this.navigation = new Navigation(navigationSettings)
    this.commandQueue = new CommandQueue()
    this.commands = []
    this.flipFlop = false
  }

  tick () {
    // TODO: things to do on a heartbeat timer ...
    if (this.flipFlop) {
      this.tempPressureReader.getTemperature()
    } else {
      this.tempPressureReader.getPressure()
    }
    this.flipFlop = !this.flipFlop
    console.log(`Temperature ${this.tempPressureReader.lastTemperature}°C  Pressure ${this.tempPressureReader.lastPressure}hPa`)
  }
}

module.exports = Brain
