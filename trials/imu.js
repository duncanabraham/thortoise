require('./common.js')
const ICM20948 = require('../lib/i2c/ICM20948')
const { delay } = require('../lib/utils')

const imu = new ICM20948()

const run = async () => {
  while (true) {
    if (imu.dataReady()) {
      imu.getData()
      console.log(imu.Gyro, '    ', imu.Accelerometer, '    ', imu.Compass, '    ', imu.Temperature)
      await delay(1000)
    } else {
      await delay(10)
    }
  }
}

run()
