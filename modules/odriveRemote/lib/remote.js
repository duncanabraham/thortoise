const { expect } = require('chai')
const ODrive = require('../../../lib/odrive')
const { uart, baud, maxSpeed } = require('../config')

const GPIOPin = require('./GPIOPin')

const { log } = global.app

class LED extends GPIOPin {
  constructor(pinNumber, name) {    
    super(pinNumber)
    this.name = name
    this.setDirection('out')
  }

  async turnOn() {
    await this.setState('1')
  }

  async turnOff() {
    await this.setState('0')
    if (this.isFlashing) {
      this.isOn = false
      this.isFlashing = false
      clearInterval(this.flashInterval)
    }
  }

  long() {
    this.startFlashing('long')
  }

  short() {
    this.startFlashing('short')
  }

  // Method to start flashing with the specified pattern
  startFlashing(pattern) {
    if (!this.isFlashing) {
      this.isFlashing = true
      this.onState = true

      const flasher = () => {
        console.log('flasher called')
        if (this.onState) { this.turnOn() } else { this.turnOff() }
        this.onState = !this.onState
        
        const timeout = (pattern === 'long' && this.onState) || (pattern === 'short' && !this.onState) ? 1000 : 500
        console.log(`${this.name} : onState: ${this.onState}`)
        console.log(`${this.name} : timeout: ${timeout}`)
        console.log(`${this.name} : pattern: ${pattern}`)
        console.log(`${this.name} : flashing: ${this.isFlashing}`)
        if (!this.isFlashing) { return }
        setTimeout(flasher.bind(this), timeout)
      }

      flasher()
    }
  }
}

const redLED = new LED(11, 'red')
const yellowLED = new LED(79, 'yellow') // Targetting a different GPIO Bank GPIOA_15
const greenLED = new LED(4, 'green')

const rag = (data) => {
  const { red, yellow, green } = data // each can be 0=off, 1=on, 2=long flash, 3=short flash

  if (typeof red !== 'number' || typeof yellow !== 'number' || typeof green !== 'number') {
    throw new Error('Invalid LED status values')
  }

  // Set the LED status based on the data
  const states = ['turnOff', 'turnOn', 'long', 'short']
  if (red != -1) { redLED[states[red]]() }
  if (yellow != -1) { yellowLED[states[yellow]]() }
  if (green != -1) { greenLED[states[green]]() }
}

class Remote {
  constructor() {
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

  async init() {
    rag({ red: 2, yellow: 3, green: 1 })
    await this.motorController.init()
    await this.motorController.calibrate()
    rag({ red: 0, yellow: 0, green: 0 })
    // await this.stop()
  }

  get motors() {
    return this._motors
  }

  get odrv() {
    return this._odrv
  }

  async getErrors() {
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

  async getStatus() {
    const response = this.motorController.response
    await this.motorController.write('r vbus_voltage\n')
    const vbus = await this.motorController.read()
    await this.motorController.write('r ibus\n')
    const ibus = await this.motorController.read()
    const error = await this.getErrors()
    return { ...this.status, response, vbus, ibus, error }
  }

  setStatus(data) { // receive an object that looks like: {red: 0, yellow: 0, green: 0} //  0=off, 1=on, 2=long, 3=short
    // Validate data object
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid LED data object')
    }
    rag(data)
  }

  async setSpeed(motor, speed) {
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

  async stop() {
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
