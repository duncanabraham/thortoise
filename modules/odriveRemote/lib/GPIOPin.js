const fs = require('fs')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

class GPIOPin {
  constructor(pinNumber) {
    this.base = 412
    this.gpio = this.base + pinNumber
    this._gpioPath = `/sys/class/gpio/gpio${this.gpio}/`
  }

  async _writeFile(path, value) {
    try {
      await writeFile(path, value, 'utf8')
    } catch (err) {
      console.error(`Failed to write to ${path}: ${err}`)
    }
  }

  async _readFile(path) {
    try {
      return await readFile(path, 'utf8')
    } catch (err) {
      console.error(`Failed to read from ${path}: ${err}`)
    }
  }

  async setDirection(direction) {
    await this._writeFile(`${this._gpioPath}direction`, direction)
  }

  async setState(state) {
    await this._writeFile(`${this._gpioPath}value`, state)
  }

  async getState() {
    return await this._readFile(`${this._gpioPath}value`)
  }
}

module.exports = GPIOPin
