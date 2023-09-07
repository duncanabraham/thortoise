const ODrive = require('../../../lib/odrive')

const uart = '/dev/ttyAML0' // /dev/ttyAML0 = Radxa UART_A, /dev/ttyAML1 = Radxa UART_B
const baud = 115200

class Remote {
  constructor () {
    this.maxSpeed = 16
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
    await this.stop()
  }

  get motors () {
    return this._motors
  }

  get odrv () {
    return this._odrv
  }

  async getStatus () {
    const response = this.motorController.response
    await this.motorController.write('r vbus_voltage\n')
    const vbus = await this.motorController.read()
    return { ...this.status, response, vbus }
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
        console.log(`Do what? (motor: ${motor} to ${speed})`)
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
