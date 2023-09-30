const Feature = require('./feature')
const { CommandQueue } = require('./command')
const Navigation = require('./navigation')
const Camera = require('./camera')
const LPS22HB = require('./i2c/LPS22HB')
const SC16IS752 = require('./i2c/SC16IS752')

const { navigationSettings } = require('../config')

/*
The Brain class is the main class that will determine what to do, how to do it and what commands
need to be added to the commandQueue. It will work with sensors to keep track of where it is and where it's going
*/

const featureOptions = {
  type: 'CORE',
  group: 'SYSTEM',
  DONOTREGISTER: true,
  resumeHandler: () => { },
  pauseHandler: () => { }
}

class Brain extends Feature {
  constructor (options = {}) {
    super({ ...featureOptions })
    delete this.redisClient
    delete this.resumeHandler
    delete this.pauseHandler
    this.temperaturePressureReader = new LPS22HB({ i2cAddress: 0x5C })
    this.camera = new Camera(options.cameraSettings)
    this.navigation = new Navigation({ redisClient: options.redisClient, ...navigationSettings })
    this.commandQueue = new CommandQueue()
    this.GPIO2 = new SC16IS752() // 8 programmable pins for I/O
    this.commands = []
    this.desiredBearing = 270
    this.actualBearing = this.navigation.compass.heading || 999
  }

  init () {
    this.camera.init()
    this.navigation.init()
    this.running = setInterval(this.run.bind(this), 1000)
  }

  run () {
    this.actualBearing = this.navigation.compass.heading
    this.navigationValues = this.navigation.getValues()
    this.pressure = this.temperaturePressureReader.pressure
    this.temperature = this.temperaturePressureReader.temperature
  }
}

module.exports = Brain
