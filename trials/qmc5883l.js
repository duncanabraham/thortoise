const i2c = require('i2c-bus')
const i2cBus = i2c.openSync(1)
const fs = require('fs').promises
const path = require('path')

const MPU6050_ADDRESS = 0x68
const QMC5883L_ADDRESS = 0x0D

let lastHeading = 0
let minX = Infinity; let maxX = -Infinity; let minY = Infinity; let maxY = -Infinity

async function initMinMax () {
  const filePath = path.join(__dirname, 'calibrationData.json')
  try {
    const data = await fs.readFile(filePath, 'utf8')
    const calibrationData = JSON.parse(data)
    ;({ minX, maxX, minY, maxY } = calibrationData)
  } catch (err) {
    // File does not exist or other error
    console.error(err)
    process.exit(1)
  }
  await storeMinMax()
}

async function storeMinMax () {
  const filePath = path.join(__dirname, 'calibrationData.json')
  const calibrationData = { minX, maxX, minY, maxY }
  await fs.writeFile(filePath, JSON.stringify(calibrationData))
}

function readHeading () {
  // Read accelerometer data from MPU-6050
  const accelBuffer = Buffer.alloc(6)
  i2cBus.readI2cBlockSync(MPU6050_ADDRESS, 0x3B, 6, accelBuffer)
  const ax = accelBuffer.readInt16BE(0)
  const ay = accelBuffer.readInt16BE(2)
  const az = accelBuffer.readInt16BE(4)

  // Calculate pitch and roll angles
  const pitch = Math.atan2(-ay, Math.sqrt(ax * ax + az * az))
  const roll = Math.atan2(ax, Math.sqrt(ay * ay + az * az))

  // Read magnetometer data from QMC5883L
  const magBuffer = Buffer.alloc(6)
  i2cBus.readI2cBlockSync(QMC5883L_ADDRESS, 0x00, 6, magBuffer)
  const x = magBuffer.readInt16LE(0)
  const y = magBuffer.readInt16LE(2)
  const z = magBuffer.readInt16LE(4)

  // Update min and max values for x and y for calibration
  if (x < minX) minX = x
  if (x > maxX) maxX = x
  if (y < minY) minY = y
  if (y > maxY) maxY = y

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

function outputHeading () {
  console.log(`Heading: ${lastHeading} degrees`)
}

async function initialize () {
  await initMinMax()
  initializeSensors()
  setInterval(readHeading, 100)
  setInterval(outputHeading, 1000)
}

function initializeSensors () {
  i2cBus.writeByteSync(QMC5883L_ADDRESS, 0x09, 0b00111101)
  i2cBus.writeByteSync(MPU6050_ADDRESS, 0x6B, 0x00)
}

initialize().catch(err => {
  console.error('Failed to initialize:', err)
})
