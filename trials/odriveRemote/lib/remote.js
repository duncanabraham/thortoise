const ODrive = require('../../../lib/odrive')
const { uart, baud, maxSpeed } = require('../config')
const SC16IS752 = require('../../../lib/i2c/SC16IS752')
const serialHat = new SC16IS752()
serialHat.setAllOut()
serialHat.writeByte(0xAA) // 10101010
const { log } = global.app

const rag = (object) => {
  let status = serialHat.readByte()
  status = status + object.red ? 1 : 0
  status = status + object.yellow ? 2 : 0
  status = status + object.green ? 4 : 0
  serialHat.writeByte(status)
}

class Remote {
  constructor () {
    this.maxSpeed = maxSpeed
    this.runState = 0
    this.motorController = new ODrive(uart, baud)
    this._odrv = {
      vbus: 0,
      ibus: 0,
      error: 'OK'
    }
    this._motors = {
      left: {
        setSpeed: 0,
        velocity: 0,
        position: 0,
        mechanical: 0,
        electrical: 0
      },
      right: {
        setSpeed: 0,
        velocity: 0,
        position: 0,
        mechanical: 0,
        electrical: 0
      }
    }
    this.init()
  }

  async init () {
    await this.motorController.init()
    await this.motorController.calibrate()
    // await this.stop()
  }

  get motors () {
    return this._motors
  }

  get odrv () {
    return this._odrv
  }

  async getErrors () {
    const error = {
      axis0: 0,
      axis1: 0,
      encoder0: 0,
      encoder1: 0,
      motor0: 0,
      motor1: 0
    }
    await this.motorController.write('r axis0.error\n')
    error.axis0 = await this.motorController.read()
    await this.motorController.write('r axis1.error\n')
    error.axis1 = await this.motorController.read()

    await this.motorController.write('r axis0.encoder.error\n')
    error.encoder0 = await this.motorController.read()
    await this.motorController.write('r axis1.encoder.error\n')
    error.encoder1 = await this.motorController.read()

    await this.motorController.write('r axis0.motor.error\n')
    error.motor0 = await this.motorController.read()
    await this.motorController.write('r axis1.motor.error\n')
    error.motor1 = await this.motorController.read()
    return error
  }

  async getStatus () {
    const response = this.motorController.response
    await this.motorController.write('r vbus_voltage\n')
    const vbus = await this.motorController.read()
    await this.motorController.write('r ibus\n')
    const ibus = await this.motorController.read()
    const error = await this.getErrors()
    return { ...this.status, response, vbus, ibus, error }
  }

  setStatus (data) { // receive an object that looks like: {red: 0, yellow: 0, green: 0}
    // need to check the object is valid
    rag(data)
  }

  async setSpeed (motor, speed) {
    if (!this.runState) {
      // Set the MC to closed loop control mode
      await this.motorController.write('w axis0.requested_state 8\n')
      await this.motorController.write('w axis1.requested_state 8\n')
      this.runState = 1
    }
    this._motors[motor].setSpeed = speed
    const adjustedSpeed = (this.maxSpeed / 100) * speed
    switch (motor) {
      case 'left':
        await this.motorController.write(`w axis0.controller.input_vel ${adjustedSpeed}\n`)
        break
      case 'right':
        await this.motorController.write(`w axis1.controller.input_vel ${adjustedSpeed}\n`)
        break
      default:
        log.info(`Do what? (motor: ${motor} to ${speed})`)
    }
  }

  async stop () {
    await this.setSpeed('left', 0)
    await this.setSpeed('right', 0)

    // Set the MC to idle mode
    await this.motorController.write('w axis0.requested_state 1\n')
    await this.motorController.write('w axis1.requested_state 1\n')
    await this.motorController.clearErrors()
    this.runState = 0
  }
}

module.exports = new Remote()
