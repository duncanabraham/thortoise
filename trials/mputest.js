const i2c = require('i2c-bus')

const MPU6050_ADDR = 0x68
const PWR_MGMT_1 = 0x6B
const ACCEL_XOUT_H = 0x3B

async function readWord(bus, address, register) {
  const high = await bus.readByte(address, register)
  const low = await bus.readByte(address, register + 1)
  return (high << 8) | low
}

async function getPitchAndRoll(bus) {
  // Read accelerometer data
  const accelX = await readWord(bus, MPU6050_ADDR, ACCEL_XOUT_H)
  const accelY = await readWord(bus, MPU6050_ADDR, ACCEL_XOUT_H + 2)
  const accelZ = await readWord(bus, MPU6050_ADDR, ACCEL_XOUT_H + 4)

  // Calculate pitch and roll
  const pitch = Math.atan2(accelY, Math.sqrt(accelX * accelX + accelZ * accelZ)) * (180 / Math.PI)
  const roll = Math.atan2(accelX, Math.sqrt(accelY * accelY + accelZ * accelZ)) * (180 / Math.PI)

  console.log(`Pitch: ${pitch} degrees`)
  console.log(`Roll: ${roll} degrees`)
}

async function main() {
  const bus = await i2c.openPromisified(1)

  // Initialize the MPU6050
  await bus.writeByte(MPU6050_ADDR, PWR_MGMT_1, 0)

  setInterval(async () => {
    try {
      await getPitchAndRoll(bus)
    } catch (err) {
      console.error(err)
    }
  }, 1000) // Update every 1 second
}

main().catch(err => console.error(err))
