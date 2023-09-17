const Serial = require('./serial.js')
const { delay } = require('./utils')
const { odriveSettings } = require('../config.js')
const log = require('./log')

// For reference:
// const commandT = {
//   CANOPEN_NMT_MESSAGE: 0x000,
//   CANOPEN_HEARTBEAT_MESSAGE: 0x700,
//   ODRIVE_HEARTBEAT_MESSAGE: 0x001,
//   ODRIVE_ESTOP_MESSAGE: 0x002,
//   GET_MOTOR_ERROR: 0x003,
//   GET_ENCODER_ERROR: 0x004,
//   GET_SENSORLESS_ERROR: 0x005,
//   SET_AXIS_REQUESTED_STATE: 0x007,
//   SET_AXIS_STARTUP_CONFIG: 0x008,
//   GET_ENCODER_ESTIMATES: 0x009,
//   GET_ENCODER_COUNT: 0x00A,
//   MOVE_TO_POS: 0x00B,
//   SET_POS_SETPOINT: 0x00C,
//   SET_VEL_SETPOINT: 0x00D,
//   SET_CURRENT_SETPOINT: 0x00E,
//   SET_VELOCITY_LIMIT: 0x00F,
//   START_ANTICOGGING: 0x010,
//   SET_TRAJ_VEL_LIMIT: 0x011,
//   SET_TRAJ_ACCEL_LIMITS: 0x012,
//   SET_TRAJ_A_PER_COUNT: 0x013,
//   GET_IQ: 0x014,
//   GET_SENSORLESS_ESTIMATES: 0x015,
//   REBOOT_ODRIVE: 0x016,
//   GET_VBUS_VOLTAGE: 0x017,
//   CLEAR_ERRORS: 0x018
// }

const axisStateT = {
  AXIS_STATE_UNDEFINED: 0, // <-- will fall through to idle
  AXIS_STATE_IDLE: 1, // <-- disable PWM and do nothing
  AXIS_STATE_STARTUP_SEQUENCE: 2, // <-- the actual sequence is defined by the config.startup_... flags
  AXIS_STATE_FULL_CALIBRATION_SEQUENCE: 3, // <-- run all calibration procedures, then idle
  AXIS_STATE_MOTOR_CALIBRATION: 4, // <-- run motor calibration
  AXIS_STATE_SENSORLESS_CONTROL: 5, // <-- run sensorless control
  AXIS_STATE_ENCODER_INDEX_SEARCH: 6, // <-- run encoder index search
  AXIS_STATE_ENCODER_OFFSET_CALIBRATION: 7, // <-- run encoder offset calibration
  AXIS_STATE_CLOSED_LOOP_CONTROL: 8, // <-- run closed loop control
  AXIS_STATE_LOCKIN_SPIN: 9, // <-- Spin it up!
  AXIS_STATE_ENCODER_DIR_FIND: 10,
  AXIS_STATE_HOMING: 11,
  AXIS_STATE_ANTICOGGING_CALIBRATION: 14
}

const axis = ['axis0', 'axis1']

class ODrive {
  constructor (uartId, baudRate = 115200) {
    log.info('uartId: ', uartId)
    log.info('baud: ', baudRate)
    this.uart = new Serial(uartId, baudRate)
    this.directions = [1, 1] // 1 = forward, -1 = reverse
    this.speed = 50 // %
  }

  async write (data) {
    log.info('writing: ', data)
    await this.uart.write(data)
  }

  async read (data) { // really read(data) ?
    log.info('reading: ', data)
    return this.uart.read(data)
  }

  async close () {
    await this.uart.close()
  }

  async setState (motor, state) {
    await this.write(`w axis${motor}.requested_state ${state}\n`)
  }

  async init () {
    log.info('Initialising ODRIVE Motor Controller')
    await this.write('w config.brake_resistance 0.5\n')
    await this.write('w config.dc_bus_undervoltage_trip_level 18\n')
    await this.write('w config.enable_brake_resistor True\n')

    for (const motor of axis) {
      // await this.write(`w ${motor}.encoder.config.ignore_illegal_hall_state True\n`)
      await this.write(`w ${motor}.encoder.config.mode 0\n`) // 0 = ENCODER_MODE_INCREMENTAL, 1 = ENCODER_MODE_HALL
      await this.write(`w ${motor}.encoder.config.cpr ${odriveSettings.ENCODER_CPR}\n`)
      await this.write(`w ${motor}.encoder.config.calib_range 0.05\n`)
      await this.write(`w ${motor}.encoder.config.bandwidth ${odriveSettings.BANDWIDTH}\n`)
      // await this.write(`w ${motor}.encoder.config.zero_count_on_find_idx False\n`)
      await this.write(`w ${motor}.motor.config.current_lim ${odriveSettings.CURRENT_LIMIT}\n`)
      await this.write(`w ${motor}.motor.config.current_control_bandwidth ${odriveSettings.BANDWIDTH}\n`)
      await this.write(`w ${motor}.controller.config.input_mode 1\n`)
      // await this.write(`w ${motor}.controller.config.control_mode 2\n`) // 2 = VELOCITY_CONTROL, 3 = POSITION_CONTROL // DO THIS AFTER CALIBRATION
      await this.write(`w ${motor}.controller.config.vel_limit ${odriveSettings.VEL_LIMIT}\n`)
      await this.write(`w ${motor}.controller.config.pos_gain ${odriveSettings.POS_GAIN}\n`)
      await this.write(`w ${motor}.controller.config.vel_gain ${odriveSettings.VEL_GAIN}\n`)
      await this.write(`w ${motor}.controller.config.vel_integrator_gain ${odriveSettings.INTEGRATOR}\n`)
    }
    await this.zeroMotors()
    log.info('Done')
  }

  async disableMotors () {
    for (const motor of axis) {
      await this.write(`w ${motor}.requested_state ${axisStateT.AXIS_STATE_IDLE}\n`)
    }
  }

  get response () {
    return this.uart.output
  }

  async clearErrors () {
    log.info('Clearing errors')
    await this.write('sc\n')
  }

  async zeroMotors () {
    for (const motor of axis) {
      await this.write(`w ${motor}.controller.input_vel 0\n`)
      await this.write(`w ${motor}.controller.input_pos 0\n`)
    }
  }

  async turnLeft () {
    await this.setSpeed(0, this.speed)
    await this.setSpeed(1, -this.speed)
  }

  async turnRight () {
    await this.setSpeed(0, -this.speed * this.directions[0])
    await this.setSpeed(1, this.speed * this.directions[1])
  }

  /**
   * Calculate a motor speed in terms of max=64 rpm and min=16
   * @param {number} perc
   * @returns
   */
  percToRpm (perc) {
    const maxSpeed = 64 * 2 // 2 turns per second
    const minSpeed = 16 // 0.25 turns per second
    return ((maxSpeed - minSpeed) / 100 * perc) + minSpeed
  }

  async setSpeed (motor, speed) { // speed in %
    this.speed = speed
    await this.write(`w axis${motor}.controller.input_vel ${this.percToRpm(speed) * this.directions[motor]}\n`)
  }

  setDirection (motor, direction) {
    this.directions[motor] = direction // either 1 or -1
  }

  async calibrate () {
    log.info('Starting Calibration')
    this.clearErrors()
    await delay(100)

    // for (const motor of axis) {
    //   // await this.setState(i, axisStateT.AXIS_STATE_ENCODER_INDEX_SEARCH)
    //   await this.write(`w ${motor}.requested_state ${axisStateT.AXIS_STATE_ENCODER_INDEX_SEARCH}\n`)
    // }

    // await delay(3000)

    for (const motor of axis) {
      // await this.setState(i, axisStateT.AXIS_STATE_ENCODER_OFFSET_CALIBRATION)
      await this.write(`w ${motor}.requested_state ${axisStateT.AXIS_STATE_ENCODER_OFFSET_CALIBRATION}\n`)
    }

    // for (const motor of axis) {
    //   await this.write(`w ${motor}.requested_state 3\n`)
    // }

    await delay(10000)

    for (const motor of axis) {
      await this.write(`w ${motor}.controller.config.control_mode 2\n`) // 2 = VELOCITY_CONTROL, 3 = POSITION_CONTROL
    }

    await delay(1000)

    for (const motor of axis) {
      await this.write(`w ${motor}.requested_state 8\n`) // 2 = VELOCITY_CONTROL, 3 = POSITION_CONTROL
    }

    log.info('Calibration Complete')
    global.app.ready = true
  }

  async enableClosedLoop () {
    for (const motor of axis) {
      await this.write(`w ${motor}.requested_state 8\n`)
    }
  }
}

module.exports = ODrive
