const ODrive = require('../lib/odrive')

const motorController = new ODrive('/dev/ttyACM0', 115200)


const run = async () => {
  await motorController.init()
}

run()
