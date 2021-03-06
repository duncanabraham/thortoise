const Feature = require('./feature')
const { CommandQueue } = require('./command')
const Navigation = require('./navigation')
const Camera = require('./camera')
// const LPS22HB = require('./LPS22HB')
// const PCA9685MC = require('./MotorController')
const SensorMux = require('./sensorMux')
const MPU6050 = require('./i2c/MPU6050')

const { config: navigationSettings } = require('../config')

/* The Brain class is the main class that will determine what to do, how to do it and what commands
need to be added to the commandQueue */

const featureOptions = {
  type: 'CORE',
  group: 'SYSTEM',
  resumeHandler: () => {},
  pauseHandler: () => {}
}

class Brain extends Feature {
  constructor (options = {}) {
    super({ ...options, ...featureOptions })
    // this.temperaturePressureReader = new LPS22HB({ i2cAddress: 0x5C })

    // this.motorController = new PCA9685MC()
    this.camera = new Camera(options.cameraSettings)
    this.navigation = new Navigation(navigationSettings)
    this.commandQueue = new CommandQueue()
    this.imu = new MPU6050()
    this.commands = []
    this.desiredBearing = 270
    this.actualBearing = 180 // get this from the GPS/IMU
    this.sensorArray = new SensorMux() // general purpose sensor array 0-3 are light sensors
  }

  _init () {
    this.imu.setAccelRange(this.imu.ACCEL_RANGE_8G)
    this.imu.run()
  }
}

module.exports = Brain
