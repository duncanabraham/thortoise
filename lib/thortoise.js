const ServoDriver = require('./servoDriver')
const Leg = require('./leg')
const Triplet = require('./triplet')
const { Grid, GridItem, coords } = require('./grid')

const driver = new ServoDriver() // allows direct communication with the hardware

class Thortoise {
  constructor(options) {
    const gridWidth = options.gridWidth || 100
    const gridLength = options.gridLength || 300
    this.posX = gridWidth / 2
    this.posY = gridLength / 2
    this.grid = new Grid(gridWidth, gridLength)
    Object.assign(this, options)
    this.init()
  }

  init() {
    this.legs = {
      leftFront: new Leg({id: 0, driver}),
      rightFront: new Leg({id: 1, driver}),
      leftRear: new Leg({id: 2, driver}),
      rightRear: new Leg({id: 3, driver})
    }
  }

  forward() {

  }

  reverse() {

  }

  right() {

  }

  left() {

  }
}

module.exports = Thortoise
