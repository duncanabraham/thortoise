const { move } = require('./kinematics')
const { QuadPos } = require('./pos')

/**
 * Calculate foot positions by moving each foot in a small circle, eith cw or ccw to cause motion in a particular direction
 */
class Walk {
  constructor (options) {
    this.tick = 0
    Object.assign(this, options)
  }

  setTicks (t) {
    this.ticks = t
  }

  /**
   * move the tick counter either forward or backwards depending on the direction
   */
  tock () {
    const d = ['forward', 'right', 'left'].includes(this.direction) ? 1 : -1
    this.tick = this.tick + d
    if (this.tick === this.ticks) {
      this.tick = 0
    }

    if (this.tick < 0) {
      this.tick = this.ticks
    }
  }

  nextStep (direction) {
    const { l1, l2, l3, l4 } = this.legPositions

    switch (direction) {
      case 'forward':
        l1.position = move(l1, this.ticks, this.tick)
        l2.position = move(l2, this.ticks, this.tick)
        l3.position = move(l3, this.ticks, this.tick)
        l4.position = move(l4, this.ticks, this.tick)
        break
      case 'backward':
        l1.position = move(l1, this.ticks, this.tick - 1)
        l2.position = move(l2, this.ticks, this.tick - 1)
        l3.position = move(l3, this.ticks, this.tick - 1)
        l4.position = move(l4, this.ticks, this.tick - 1)
        break
      case 'left':
        l1.position = move(l1, this.ticks, this.tick + 1)
        l2.position = move(l2, this.ticks, this.tick - 1)
        l3.position = move(l3, this.ticks, this.tick + 1)
        l4.position = move(l4, this.ticks, this.tick - 1)
        break
      case 'right':
        l1.position = move(l1, this.ticks, this.tick - 1)
        l2.position = move(l2, this.ticks, this.tick + 1)
        l3.position = move(l3, this.ticks, this.tick - 1)
        l4.position = move(l4, this.ticks, this.tick + 1)
        break
      case 'stop':
        // don't change the values of the t's
        break
    }
    return new QuadPos(l1, l2, l3, l4)
  }
}

module.exports = Walk
