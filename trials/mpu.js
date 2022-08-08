require('./common')
const MPU6050 = require('../lib/i2c/MPU6050')
const imu = new MPU6050()

imu.setAccelRange(imu.ACCEL_RANGE_8G)
imu.run()

console.log('temperature:', imu.getTemp())

while (true) {
  const data = imu.getValue()
  console.log(data)
}

