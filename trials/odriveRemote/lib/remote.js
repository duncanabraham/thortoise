const ODrive = require('../../../lib/odrive')
const uart = '/dev/ttyAML1' // /dev/ttyAML0 = Radxa UART_A, /dev/ttyAML1 = Radxa UART_B
const baud = 115200

class Remote {
  constructor() {
    this.maxSpeed = 16
    this.runState = 0
    this.motorController = new ODrive(uart, baud)

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

    this._odrv = {
      vbus: 0,
      ibus: 0,
      error: 'OK'
    }

    this.init()
  }

  async setSpeed(motor, speed) {
    if (!this.runState) {
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
    }
  }

  async stop() {
    await this.setSpeed('left', 0)
    await this.setSpeed('right', 0)
    // Set the MC to idle mode
    await this.motorController.write('w axis0.requested_state 1\n')
    await this.motorController.write('w axis1.requested_state 1\n')
    this.runState = 0
  }

  async init() {
    await this.motorController.init()
    await this.motorController.calibrate()
    await this.stop()
  }

  get motors() {
    return this._motors
  }

  get odrv() {
    return this._odrv
  }
}

module.exports = new Remote()
