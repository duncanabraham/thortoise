const Feature = require('./feature')
const { CommandQueue } = require('./command')
const Navigation = require('./navigation')
const Camera = require('./camera')
// const LPS22HB = require('./LPS22HB')
// const PCA9685MC = require('./MotorController')
const ODrive = require('./odrive')
const SensorMux = require('./sensorMux')

const { config: navigationSettings } = require('../config')

/* The Brain class is the main class that will determine what to do, how to do it and what commands
need to be added to the commandQueue */

const featureOptions = {
  type: 'CORE',
  group: 'SYSTEM',
  resumeHandler: () => { },
  pauseHandler: () => { }
}

class Brain extends Feature {
  constructor (options = {}) {
    super({ ...options, ...featureOptions })
    // this.temperaturePressureReader = new LPS22HB({ i2cAddress: 0x5C })

    // this.motorController = new PCA9685MC()
    this.motorController = new ODrive('/dev/ttyUSB')
    this.camera = new Camera(options.cameraSettings)
    this.navigation = new Navigation(navigationSettings)
    this.commandQueue = new CommandQueue()
    this.commands = []
    this.desiredBearing = 270
    this.actualBearing = 180 // get this from the GPS/IMU
    this.sensorArray = new SensorMux({ i2cAddress: 0x77 }) // general purpose sensor array 0-3 are light sensors
  }

  init () {
    this.motorController.init()
    this.camera.init()
    this.navigation.init()
    this.sensorArray.init()
    this.running = setInterval(this.run.bind(this), 1000)
  }

  run () {
    this.sensorValues = this.sensorArray.getValues()
    this.navigationValues = this.navigation.getValues()
  }
}

module.exports = Brain
