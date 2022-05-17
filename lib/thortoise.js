const ServoDriver = require('./servoDriver')
const Leg = require('./leg')
const { Grid, coords } = require('./grid')

const driver = new ServoDriver() // allows direct communication with the hardware
class Thortoise {
  constructor (options) {
    const gridWidth = options.gridWidth || 100
    const gridLength = options.gridLength || 300

    this.position = coords(gridWidth / 2, gridLength / 2)

    this.grid = new Grid(gridWidth, gridLength)
    Object.assign(this, options)
    this.init()
  }

  init () {
    this.legs = {
      leftFront: new Leg({ id: 0, driver, servo: this.servo, hipServo: this.hipServo, femurServo: this.femurServo, kneeServo: this.kneeServo }),
      rightFront: new Leg({ id: 1, driver, servo: this.servo, hipServo: this.hipServo, femurServo: this.femurServo, kneeServo: this.kneeServo }),
      leftRear: new Leg({ id: 2, driver, servo: this.servo, hipServo: this.hipServo, femurServo: this.femurServo, kneeServo: this.kneeServo }),
      rightRear: new Leg({ id: 3, driver, servo: this.servo, hipServo: this.hipServo, femurServo: this.femurServo, kneeServo: this.kneeServo })
    }
  }

  forward () {

  }

  reverse () {

  }

  right () {

  }

  left () {

  }

  runLoop () {
    // Do this many times per second (think Arduino!)
  }

  start () {
    const loopSpeedMS = 1000 / 100 // 100 times per second
    this.legs.forEach(leg => leg.setPosition(0))
    this.running = setInterval(this.runLoop, loopSpeedMS)
  }

  stop () {
    if (this.running) {
      clearInterval(this.running)
      delete this.running
    }
  }
}

module.exports = Thortoise
