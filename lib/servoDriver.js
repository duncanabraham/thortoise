let devMode = false
  const i2cBus = require('i2c-bus')
  const Pca9685Driver = require('pca9685').Pca9685Driver

const { constrain } = require('./utils')

const options = {
  i2c: i2cBus.openSync(1),
  address: 0x40,
  frequency: 50,
  debug: false
}

const init = () => {
  return new Pca9685Driver(options, function (err) {
    if (err) {
      console.error('Error initializing PCA9685')
      process.exit(-1)
    }
  })
}

const angleAsdutyCycle = (angle) => {
  // Angle 0-180
  // Duty cycle 0->1 with 1 being 100%
  return angle * (1 / 180)
}

class ServoDriver {
  constructor() {
    this.pwm = init()
    this.setDefaults()
  }

  setDefaults() {
    for (let i = 0; i < 16; i++) {
      this.pwm.channelOff(i, (err) => {
        if (err) {
          console.error(`Error turning off channel ${i}`)
        }
      })
      if (i < 12) {
        this.pwm.channelOn(i, (err) => {
          if (err) {
            console.error(`Error turning on channel ${i}`)
          }
        })
      }
    }
    console.log("PCA9685 Initialisation complete")
  }

  setPosition(channel, angle) {
    angle = constrain(angle)
    this.pwm.setDutyCycle(channel, angleAsdutyCycle(angle))
  }
}

module.exports = ServoDriver
