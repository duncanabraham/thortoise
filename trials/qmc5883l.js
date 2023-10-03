const i2c = require('i2c-bus')
const i2cBus = i2c.openSync(1)

const QMC5883L_ADDRESS = 0x0D

function initializeSensor() {
  // Set to Mode register to 0x09 for continuous measurement
  // Operating mode (bits [1:0]) set to Continuous measurement mode (01)
  // Output data rate (bits [3:2]) set to 10Hz (00)
  // Full Scale (bits [5:4]) set to 8 Gauss (00)
  // Over sample ratio (bits [7:6]) set to 512 (11)
  i2cBus.writeByteSync(QMC5883L_ADDRESS, 0x09, 0b00111101)

}

function readHeading() {
  const buffer = Buffer.alloc(6)

  // Read the X, Y, Z values from the sensor
  i2cBus.readI2cBlockSync(QMC5883L_ADDRESS, 0x00, 6, buffer)

  const x = buffer.readInt16LE(0)
  const y = buffer.readInt16LE(2)
  const z = buffer.readInt16LE(4)

  let heading = Math.atan2(y, x)
  
  if (heading < 0) {
    heading += 2 * Math.PI
  }
  
  const headingDegrees = heading * (180 / Math.PI)

  return Math.round(headingDegrees)
}

initializeSensor()

setInterval(() => {
  const heading = readHeading()
  console.log(`Heading: ${heading} degrees`)
}, 1000)
