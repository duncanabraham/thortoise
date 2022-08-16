const Feature = require('./feature')
const Pin = require('./pin')

const featureOptions = {
  type: 'OPTIONAL',
  group: 'MOTION',
  resumeHandler: () => {},
  pauseHandler: () => {}
}

class Wheel {
  constructor (options) {
    this.pinF = new Pin({ pin: options.fPin, direction: 'out' })
    this.pinB = new Pin({ pin: options.bPin, direction: 'out' })
  }

  forward () {
    this.pinF.on()
    this.pinB.off()
  }

  backward () {
    this.pinF.off()
    this.pinB.on()
  }

  stop () {
    this.pinF.off()
    this.pinB.off()
  }
}

class Wheels extends Feature {
  constructor (options) {
    super(featureOptions)
    this.wheels = {
      frontLeft: new Wheel(options.frontLeft),
      frontRight: new Wheel(options.frontRight),
      backLeft: new Wheel(options.backLeft),
      backRight: new Wheel(options.backRight)
    }
  }

  forward () {
    Object.keys(this.wheels).forEach(key => {
      this.wheels[key].forward()
    })
  }

  backward () {
    Object.keys(this.wheels).forEach(key => {
      this.wheels[key].forward()
    })
  }

  left () {
    this.wheels.frontLeft.backward()
    this.wheels.backLeft.backward()
    this.wheels.frontRight.forward()
    this.wheels.backRight.forward()
  }

  right () {
    this.wheels.frontLeft.forward()
    this.wheels.backLeft.forward()
    this.wheels.frontRight.backward()
    this.wheels.backRight.backward()
  }

  stop () {
    Object.keys(this.wheels).forEach(key => {
      this.wheels[key].stop()
    })
  }
}

module.exports = Wheels
