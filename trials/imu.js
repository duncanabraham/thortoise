const ICM20948 = require('../lib/ICM20948')
const { delay } = require('../lib/utils')

const imu = new ICM20948()

const run = async () => {
  while (true) {
    imu.readAccelerometer()
    await delay(100)
    imu.readGyro()
    await delay(100)
    imu.readCompass()
    await delay(100)
    console.log('Gyro:  ', imu.Gyro)
    console.log('Accel: ', imu.Accelerometer)
    console.log('Compass: ', imu.Compass)
    await delay(1000)
  }
}

run()
