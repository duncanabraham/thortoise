const ODrive = require('../lib/odrive')
const { delay } = require('../lib/utils')

const motorController = new ODrive('/dev/ttyACM0', 115200)

const desiredVelocity = 32 // Replace with your desired velocity in RPM

const run = async () => {
  try {
    await motorController.init()
    await motorController.calibrate()

    await delay(20000)
    await motorController.write('w axis1.requested_state 8\n')
    
    await motorController.write('w axis1.controller.config.control_mode 2\n') // 2 corresponds to CONTROL_MODE_VELOCITY_CONTROL
    await motorController.write(`w axis1.controller.input_vel ${desiredVelocity}\n`)
    console.log(`Set velocity of axis1 to ${desiredVelocity / 64} RPM`) // 64:1 gearbox
  } catch (error) {
    console.error('Error:', error)
  }
}

run()
