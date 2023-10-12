const Feature = require('./feature')
const { CommandQueue } = require('./command')
const Navigation = require('./navigation')
const Camera = require('./camera')
// const LPS22HB = require('./i2c/LPS22HB')
const SC16IS752 = require('./i2c/SC16IS752')
const UPS = require('./i2c/UPS')
const { v4: uuidv4 } = require('uuid')
const log = require('./log')
const DecisionOMatic = require('./decision-o-matic')
const Weather = require('./weather')
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
    this.redisClientPub = options.redisClient.pub
    delete this.redisClient
    delete this.resumeHandler
    delete this.pauseHandler
    // this.temperaturePressureReader = new LPS22HB({ i2cAddress: 0x5C })
    this.camera = new Camera(options.cameraSettings)
    this.navigation = new Navigation({ redisClient: options.redisClient, ...navigationSettings })
    this.commandQueue = new CommandQueue()
    this.GPIO2 = new SC16IS752() // 8 programmable pins for I/O
    this.commands = []
    this.desiredBearing = 270
    this.weather = new Weather()
    this.weather.init()
    this.actualBearing = this.navigation.compass.heading || 999
    this.ups = new UPS({ i2cAddress: 0x42, ...options })
    this.DecisionOMatic = new DecisionOMatic()
  }

  checklist () {
    // TODO: interogate all devices to ensure they're online and return a list for the speach Engine to read out as <device>: <check | failed>
  }

  async init () {
    // this.sound('STARTUP1')
    this.camera.init()
    await this.navigation.init()
    this.running = setInterval(this.run.bind(this), 1000)
    // this.speak('Thortoise is starting up')
    // this.speak('Sound Card enabled: check! Camera enabled: check! Navigation enabled: check! Serial expansion enabled: check! Power management enabled: check! Inertial measurement unit enabled: check! Compass enabled: check!, Light sensors enabled: check!')
    // this.sound('STARTUP2')
  }

  send (messageString) {
    // Publish the message to the "voice" channel
    console.log('sending: ', messageString)
    this.redisClientPub.publish('voice', messageString, (err, reply) => {
      if (err) {
        log.error(`Failed to publish message: ${err}`)
      } else {
        if (this.verbose) {
          log.info(`Message published: ${reply}`)
        }
      }
    })
  }

  speak (text) {
    const messageObject = {
      text,
      timestamp: Date.now(),
      id: uuidv4() // optional unique identifier for the message
    }
    // Serialize the object to a JSON string
    const messageString = JSON.stringify(messageObject)
    this.send(messageString)
  }

  sound (command, volume = 1) {
    const messageObject = {
      volume,
      command,
      timestamp: Date.now(),
      id: uuidv4()
    }
    // Serialize the object to a JSON string
    const messageString = JSON.stringify(messageObject)
    this.send(messageString)
  }

  run () {
    this.navigationValues = this.navigation.getValues()
    // this.pressure = this.temperaturePressureReader.pressure
    // this.temperature = this.temperaturePressureReader.temperature
  }
}

module.exports = Brain
