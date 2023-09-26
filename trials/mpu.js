require('./common')
const MPU6050 = require('../lib/i2c/old-devices/MPU6050')
const imu = new MPU6050()
const { delay } = require('../lib/utils')

imu.setAccelRange(imu.ACCEL_RANGE_8G)
imu.run()

console.log('temperature:', imu.getTemp())

const run = async () => {
  while (true) {
    const data = imu.getValue()
    console.log(data)
    await delay(1000)
  }
}

run()
