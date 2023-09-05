const ODrive = require('../lib/odrive')
const { delay } = require('../lib/utils')

const uart= '/dev/ttyAML0'
const baud=115200

const motorController = new ODrive(uart, baud)

const desiredVelocity = 16 // Replace with your desired velocity in RPM

const run = async () => {
  try {
    await motorController.init()
    await motorController.calibrate()

    await delay(10000)
    
    await motorController.write('w axis0.controller.config.control_mode 2\n') // 2 corresponds to CONTROL_MODE_VELOCITY_CONTROL
    await motorController.write('w axis1.controller.config.control_mode 2\n') // 2 corresponds to CONTROL_MODE_VELOCITY_CONTROL

    await motorController.write('w axis0.requested_state 8\n')
    await motorController.write('w axis1.requested_state 8\n')
    
    await motorController.write(`w axis0.controller.input_vel ${desiredVelocity}\n`)
    await motorController.write(`w axis1.controller.input_vel ${desiredVelocity * -1}\n`)

    await delay(5000)
    await motorController.write(`w axis0.controller.input_vel ${desiredVelocity * -1}\n`)
    await motorController.write(`w axis1.controller.input_vel ${desiredVelocity}\n`)

    await delay(5000)
    await motorController.write('w axis0.requested_state 1\n')
    await motorController.write('w axis1.requested_state 1\n')

    console.log(`Set velocity of axis1 to ${desiredVelocity / 64} RPM`) // 64:1 gearbox

    await motorController.zeroMotors()
    await motorController.disableMotors()

  } catch (error) {
    console.error('Error:', error)
  }
}

run()
