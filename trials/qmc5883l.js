const i2c = require('i2c-bus')
const i2cBus = i2c.openSync(1)  // Assuming you are using bus number 1

const fs = require('fs')

const MPU6050_ADDRESS = 0x68  // Replace with your MPU-6050's I2C address
const QMC5883L_ADDRESS = 0x0D  // Replace with your QMC5883L's I2C address

let lastHeading = 0
let minX = Infinity, maxX = -Infinity
let minY = Infinity, maxY = -Infinity

function initializeSensors() {
  // Set to Mode register to 0x09 for continuous measurement
  // Operating mode (bits [1:0]) set to Continuous measurement mode (01)
  // Output data rate (bits [3:2]) set to 10Hz (00)
  // Full Scale (bits [5:4]) set to 8 Gauss (00)
  // Over sample ratio (bits [7:6]) set to 512 (11)
  i2cBus.writeByteSync(QMC5883L_ADDRESS, 0x09, 0b00111101)

  // Initialize MPU-6050
  // Wake up the MPU-6050 by writing 0x00 to the power management register at address 0x6B
  i2cBus.writeByteSync(MPU6050_ADDRESS, 0x6B, 0x00)

  // Read calibration
  if (fs.existsSync('calibrationData.json')) {
    const data = fs.readFileSync('calibrationData.json', 'utf8')
      ({ minX, maxX, minY, maxY } = JSON.parse(data))
  } else {
    storeMinMax()
  }
}

const storeMinMax = () => {
  const calibrationData = { minX, maxX, minY, maxY }
  fs.writeFileSync('calibrationData.json', JSON.stringify(calibrationData))
}

function readHeading() {
  // Read accelerometer data from MPU-6050
  const accelBuffer = Buffer.alloc(6)
  i2cBus.readI2cBlockSync(MPU6050_ADDRESS, 0x3B, 6, accelBuffer)
  let ax = accelBuffer.readInt16BE(0)
  let ay = accelBuffer.readInt16BE(2)
  let az = accelBuffer.readInt16BE(4)

  // Calculate pitch and roll angles
  const pitch = Math.atan2(-ay, Math.sqrt(ax * ax + az * az))
  const roll = Math.atan2(ax, Math.sqrt(ay * ay + az * az))

  // Read magnetometer data from QMC5883L
  const magBuffer = Buffer.alloc(6)
  i2cBus.readI2cBlockSync(QMC5883L_ADDRESS, 0x00, 6, magBuffer)
  let x = magBuffer.readInt16LE(0)
  let y = magBuffer.readInt16LE(2)
  let z = magBuffer.readInt16LE(4)

  // Update min and max values for x and y for calibration
  if (x < minX) minX = x
  if (x > maxX) maxX = x
  if (y < minY) minY = y
  if (y > maxY) maxY = y

  storeMinMax()

  // Calibrate magnetometer readings
  const calibratedX = 2 * (x - minX) / (maxX - minX) - 1
  const calibratedY = 2 * (y - minY) / (maxY - minY) - 1

  // Perform tilt correction
  const xTilt = calibratedX * Math.cos(pitch) + calibratedY * Math.sin(roll) * Math.sin(pitch)
  const yTilt = calibratedY * Math.cos(roll) - calibratedX * Math.sin(pitch) * Math.sin(roll)

  // Calculate heading in radians
  let heading = Math.atan2(yTilt, xTilt)
  if (heading < 0) {
    heading += 2 * Math.PI
  }

  // Convert to degrees
  lastHeading = Math.round(heading * (180 / Math.PI))
}

function outputHeading() {
  console.log(`Heading: ${lastHeading} degrees`)
}

initializeSensors()

// Read the compass every 100ms
setInterval(readHeading, 100)

// Output the result every 1 second
setInterval(outputHeading, 1000)
