const i2c = require('i2c-bus')
const redisPubSub = require('../lib/redisPubSub')

const REG_STATUS = 0x06 // The register address for the status, verify this in the sensor datasheet
const REG_X_LSB = 0x00 // The starting register for data, verify this in the sensor datasheet

class QMC5883L {
  constructor (busNumber = 1, address = 0x0D) {
    this.i2cBus = i2c.openSync(busNumber)
    this.address = address
  }

  async _readByte (register) {
    return new Promise((resolve, reject) => {
      this.i2cBus.readByte(this.address, register, (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  async _readBytes (register, length) {
    return new Promise((resolve, reject) => {
      const buffer = Buffer.alloc(length)
      this.i2cBus.readI2cBlock(this.address, register, length, buffer, (err, bytesRead, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  _readWord (buffer, offset) {
    return buffer.readInt16LE(offset)
  }

  async _getData () {
    const status = await this._readByte(REG_STATUS)
    let x, y, z

    if (status & 1) {
      // Data is ready
      const buffer = await this._readBytes(REG_X_LSB, 6)
      x = this._readWord(buffer, 0)
      y = this._readWord(buffer, 2)
      z = this._readWord(buffer, 4)
    } else {
      throw new Error('Data not ready')
    }

    return { x, y, z }
  }

  async getBearing () {
    try {
      const { x, y, z } = await this._getData()
      let bearing = Math.atan2(y, x)
      if (bearing < 0) {
        bearing += 2 * Math.PI
      }
      // Convert to degrees
      bearing = bearing * (180 / Math.PI)
      return bearing
    } catch (e) {
      console.error(e.message)
      return null
    }
  }
}

// module.exports = QMC5883L

(async () => {
  const sensor = new QMC5883L()
  const redisClient = await redisPubSub()
  setInterval(async () => {
    const heading = await sensor.getBearing()
    if (heading !== null) {
      console.log(`Bearing: ${heading}`)
      redisClient.pub.publish('QMC5883L_data', JSON.stringify({ heading }))
    } else {
      console.log('Data not ready')
    }
  }, 200) // TODO: 5 reads per second, to be reviewed
})()
