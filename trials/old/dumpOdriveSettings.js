const ODrive = require('../../lib/odrive')
const motorController = new ODrive('/dev/ttyACM0', 115200)
const log = require('../../lib/log')

const dumpAxisSettings = async (axis) => {
  try {
    await motorController.init()

    const settings = await motorController.read(`d axis${axis}\n`)
    console.log(`Settings for axis${axis}:\n${settings}`)
  } catch (error) {
    log.error('Error:', error)
  } finally {
    motorController.close()
  }
}

// Dump settings for both axis0 and axis1
dumpAxisSettings(0)
dumpAxisSettings(1)
