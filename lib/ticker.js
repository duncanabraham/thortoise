class Ticker {
  constructor (max = 10) {
    this._maxCount = max
    this._tick = 0
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
