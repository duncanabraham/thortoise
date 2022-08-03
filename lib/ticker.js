/**
 * Just a simple looped counter that can run automatically
 */
class Ticker {
  constructor (max = 10, options = { timer: 1000, auto: false }) {
    Object.assign(this, options)
    this._maxCount = max
    this._tick = 0
    if (this.auto && this.timer) {
      this.run()
    }
  }

  run () {
    this.running = setInterval(this.tock.bind(this), this.timer)
  }

  stop () {
    if (this.running) {
      clearInterval(this.running)
      delete this.running
    }
  }

  tock () {
    this._tick++
    if (this._tick === this._maxCount) {
      this._tick = 0
    }
  }

  get tick () {
    return this._tick
  }
}

module.exports = Ticker
