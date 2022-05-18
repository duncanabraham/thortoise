let devMode
let i2cBus
let Pca9685Driver
try {
  i2cBus = require('i2c-bus')
  Pca9685Driver = require('pca9685').Pca9685Driver
  devMode = false
} catch (e) {
  console.log('Running in DEV mode')
  devMode = true
}

let options
if (!devMode) {
  options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: false
  }
}

const init = () => {
  const pwm = new Pca9685Driver(options, function (err) {
    if (err) {
      console.error('Error initializing PCA9685')
      process.exit(-1)
    }
  })
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
  console.log('PCA9685 Initialisation complete')
  return pwm
}

const angleAsDutyCycle = (angle) => {
  // Angle 0-180
  // Duty cycle 0->1 with 1 being 100%
  return angle * (1 / 180)
}

class ServoDriver {
  constructor () {
    if (!devMode) {
      this.pwm = init()
    } else {
      this.pwm = {
        setDutyCycle: () => { }
      }
    }
  }

  setPosition (channel, angle) {
    this.pwm.setDutyCycle(channel, angleAsDutyCycle(angle))
  }
}

module.exports = ServoDriver
