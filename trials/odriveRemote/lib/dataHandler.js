const ODrive = require('../../../lib/odrive')

const serialHat = new SC16IS752()

serialHat.setAllOut()
serialHat.writeByte(0xAA) // 10101010

class MotorControllerHandler {
  constructor () {
    this.motorController = new ODrive()
  }

  getHandler () {

  }
}

const motorControllerHandler = new MotorControllerHandler()

module.exports = motorControllerHandler.getHandler
