const Ticker = require('./ticker')
const { CommandQueue } = require('./command')
const Navigation = require('./navigation')
const Camera = require('./camera')
// const LPS22HB = require('./LPS22HB')
// const PCA9685MC = require('./MotorController')

const { config: navigationSettings } = require('../config')

/* The Brain class is the main class that will determine what to do, how to do it and what commands
need to be added to the commandQueue */
class Brain {
  constructor (options = {}) {
    Object.assign(this, options)
    // this.temperaturePressureReader = new LPS22HB({ i2cAddress: 0x5C })

    // this.motorController = new PCA9685MC()
    this.camera = new Camera(options.cameraSettings)
    this.navigation = new Navigation(navigationSettings)
    this.commandQueue = new CommandQueue()
    this.commands = []
    this.tickCount = new Ticker(10)
    this.desiredBearing = 270
    this.actualBearing = 180 // get this from the GPS/IMU
  }

  /**
   * This runs on an Interval every 10ms
   */
  tick () {
    // Things to do on the heartbeat timer that relate to the brain such as reading sensors and making decisions
    switch (this.tickCount.tick) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        break
    }
    this.tickCount.tock()
  }
}

module.exports = Brain
