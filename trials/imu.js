require('./common.js')
const ICM20948 = require('../lib/i2c/ICM20948')
const { delay } = require('../lib/utils')

const imuOptions = {
  name: 'ICM20948', 
  channel: 'ICM20948_data'
}

const imu = new ICM20948(imuOptions)

const run = async () => {
  while (true) {
    const data = await imu.getData().catch(e => {
      console.error('an error occurred: ', e)
    })
    console.log(data)
    await delay(1000)
  }
}

run()
