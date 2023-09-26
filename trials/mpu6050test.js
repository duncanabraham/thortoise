const i2c = require('i2c-bus')

const MPU6050_ADDR = 0x68
const PWR_MGMT_1 = 0x6B
const ACCEL_XOUT_H = 0x3B

const i2cBus = i2c.openSync(1) // Open I2C bus 1

// Initialize the MPU6050
i2cBus.writeByteSync(MPU6050_ADDR, PWR_MGMT_1, 0)

function readSensorData() {
  // Read 14 bytes starting from ACCEL_XOUT_H
  const buffer = Buffer.alloc(14)
  i2cBus.readI2cBlockSync(MPU6050_ADDR, ACCEL_XOUT_H, 14, buffer)

  const accelX = buffer.readInt16BE(0)
  const accelY = buffer.readInt16BE(2)
  const accelZ = buffer.readInt16BE(4)

  const gyroX = buffer.readInt16BE(8)
  const gyroY = buffer.readInt16BE(10)
  const gyroZ = buffer.readInt16BE(12)

  console.log(`Accel: ${accelX}, ${accelY}, ${accelZ}`)
  console.log(`Gyro: ${gyroX}, ${gyroY}, ${gyroZ}`)
}

try {
  readSensorData()
} catch (err) {
  console.error('Error reading sensor data:', err)
}
