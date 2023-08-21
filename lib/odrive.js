const Serial = require('./serial.js')
const { delay } = require('./utils')
const { odriveSettings } = require('../config.js')

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
  AXIS_STATE_HOMING: 11
}

const axis = [0, 1] // I know, just go with it

class ODrive {
  constructor (uartId, baudRate = 115200) {
    this.uart = new Serial(uartId, baudRate)
    this.directions = [1, 1] // 1 = forward, -1 = reverse
  }

  async write (data) {
    await this.uart.write(data)
  }

  async setState (motor, state) {
    await this.write(`axis${motor}.requested_state ${state}\n`)
  }

  async init () {
    await this.write('config.brake_resistance 0.5\n')
    await this.write('config.dc_bus_undervoltage_trip_level 18\n')

    axis.forEach(async motor => {
      await this.write(`axis${motor}.encoder.config.ignore_illegal_hall_state True\n`)
      await this.write(`axis${motor}.encoder.config.mode 0\n`) // 0 = ENCODER_MODE_INCREMENTAL, 1 = ENCODER_MODE_HALL
      await this.write(`axis${motor}.encoder.config.cpr ${odriveSettings.ENCODER_CPR}\n`)
      await this.write(`axis${motor}.encoder.config.calib_range 0.05\n`)
      await this.write(`axis${motor}.encoder.config.bandwidth ${odriveSettings.BANDWIDTH}\n`)
      await this.write(`axis${motor}.encoder.config.zero_count_on_find_idx False\n`)
      await this.write(`axis${motor}.motor.config.current_lim ${odriveSettings.CURRENT_LIMIT}\n`)
      await this.write(`axis${motor}.motor.config.current_control_bandwidth ${odriveSettings.BANDWIDTH}\n`)
      await this.write(`axis${motor}.controller.input_mode 1\n`)
      await this.write(`axis${motor}.controller.control_mode 2\n`) // 2 = VELOCITY_CONTROL, 3 = POSITION_CONTROL
      await this.write(`axis${motor}.controller.config.vel_limit ${odriveSettings.VEL_LIMIT}\n`)
      await this.write(`axis${motor}.controller.config.pos_gain ${odriveSettings.POS_GAIN}\n`)
      await this.write(`axis${motor}.controller.config.vel_gain ${odriveSettings.VEL_GAIN}\n`)
      await this.write(`axis${motor}.controller.config.vel_integrator_gain ${odriveSettings.INTEGRATOR}\n`)
    })
  }

  disableMotors () {
    axis.forEach(async motor => {
      await this.write(`axis${motor}.requested_state ${axisStateT.AXIS_STATE_IDLE}\n`)
    })
  }

  clearErrors () {
    axis.forEach(async motor => {
      await this.write(`axis${motor}.error 0\n`)
    })
  }

  zeroMotors () {
    axis.forEach(async motor => {
      await this.write(`axis${motor}.controller.input_vel 0\n`)
      await this.write(`axis${motor}.controller.input_pos 0\n`)
    })
  }

  async setSpeed (motor, speed) {
    await this.write(`axis${motor}.controller.input_vel ${speed}\n`)
  }

  setDirection (motor, direction) {
    this.directions[motor] = direction // either 1 or -1
  }

  async calibrate () {
    this.clearErrors()
    await delay(100)

    axis.forEach(async motor => {
      await this.setState(motor, axisStateT.AXIS_STATE_ENCODER_INDEX_SEARCH)
    })

    await delay(3000)

    axis.forEach(async motor => {
      await this.setState(motor, axisStateT.AXIS_STATE_ENCODER_OFFSET_CALIBRATION)
    })

    await delay(7000)
  }

  enableClosedLoop () {
    axis.forEach(async axis => {
      await this.write(`axis${axis}.requested_state ${axisStateT.AXIS_STATE_CLOSED_LOOP_CONTROL}\n`)
    })
  }
}

module.exports = ODrive
