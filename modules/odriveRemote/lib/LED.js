const GPIOPin = require('./GPIOPin')

class LED extends GPIOPin {
  constructor (pinNumber, name) {
    super(pinNumber)
    this.name = name
    this.onState = false
    this.setDirection('out')
  }

  async turnOn () {
    this.onState = true
    await this.setState('1')
  }

  async turnOff (flashing) { // turn it off and cancel flashing if it was running
    this.onState = false
    await this.setState('0')
    if (this.isFlashing && !flashing) {
      this.isFlashing = false
      clearTimeout(this.flashInterval)
    }
  }

  long () { // start a long flash
    this.startFlashing('long')
  }

  short () { // start a short flash
    this.startFlashing('short')
  }

  fast () { // start a fast flash
    this.startFlashing('fast')
  }

  startFlashing (pattern) {
    if (!this.isFlashing) {
      this.isFlashing = true

      const flasher = async () => {
        if (this.onState) { await this.turnOn() } else { await this.turnOff(true) }
        this.onState = !this.onState
        const timeout = pattern === 'fast' ? 100 : (pattern === 'long' && this.onState) || (pattern === 'short' && !this.onState) ? 1000 : 300
        if (!this.isFlashing) { return }
        this.flashInterval = setTimeout(flasher, timeout)
      }

      flasher()
    }
  }
}

module.exports = LED
