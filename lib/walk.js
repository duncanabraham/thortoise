const {cw, ccw} = require('./kinematics')
const { QuadTrip } = require('./triplet')

/**
 * Calculate foot positions by moving each foot in a small circle, eith cw or ccw to cause motion in a particular direction
 */
class Walk {
  constructor(options) {
    Object.assign(this, options)
    this.cardinals = {
      N: 0,
      E: Math.PI / 2,
      S: Math.PI,
      W: Math.PI + (Math.PI / 2)
    }
  }

  setRadius(r) {
    this.radius = r
  }

  setticks(t) {
    this.ticks = t
  }

  setDirection(d) {
    this.direction = d
  }

  setCurrentPosition(c) {
    this.currentPosition = c
  }

  nextStep(tick) {
    const { t1, t2, t3, t4 } = this.legPositions
    switch (this.direction) {
      case 'forward':
        t1 = cw(t1, this.cardinals.N, this.ticks, tick, this.femurLength, this.tibiaLength)
        t2 = cw(t2, this.cardinals.E, this.ticks, tick, this.femurLength, this.tibiaLength)
        t3 = cw(t3, this.cardinals.S, this.ticks, tick, this.femurLength, this.tibiaLength)
        t4 = cw(t4, this.cardinals.W, this.ticks, tick, this.femurLength, this.tibiaLength)
        break
      case 'backward':
        t1 = ccw(t1, this.cardinals.N, this.ticks, tick, this.femurLength, this.tibiaLength)
        t2 = ccw(t2, this.cardinals.E, this.ticks, tick, this.femurLength, this.tibiaLength)
        t3 = ccw(t3, this.cardinals.S, this.ticks, tick, this.femurLength, this.tibiaLength)
        t4 = ccw(t4, this.cardinals.W, this.ticks, tick, this.femurLength, this.tibiaLength)
        break
      case 'left':
        t1 = ccw(t1, this.cardinals.N, this.ticks, tick, this.femurLength, this.tibiaLength)
        t2 = ccw(t2, this.cardinals.E, this.ticks, tick, this.femurLength, this.tibiaLength)
        t3 = cw(t3, this.cardinals.S, this.ticks, tick, this.femurLength, this.tibiaLength)
        t4 = cw(t4, this.cardinals.W, this.ticks, tick, this.femurLength, this.tibiaLength)
        break
      case 'right':
        t1 = cw(t1, this.cardinals.N, this.ticks, tick, this.femurLength, this.tibiaLength)
        t2 = cw(t2, this.cardinals.E, this.ticks, tick, this.femurLength, this.tibiaLength)
        t3 = ccw(t3, this.cardinals.S, this.ticks, tick, this.femurLength, this.tibiaLength)
        t4 = ccw(t4, this.cardinals.W, this.ticks, tick, this.femurLength, this.tibiaLength)
        break
      case 'stop':
        // don't change the values of the t's
        break
    }
    return new QuadTrip(t1, t2, t3, t4)
  }
}

module.exports = Walk
