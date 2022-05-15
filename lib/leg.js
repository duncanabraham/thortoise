
const parts = [
  { name: 'hip', steps: 0.2 },
  { name: 'femur', steps: 0.2 },
  { name: 'knee', steps: 0.2 }
]

class Leg {
  constructor(options) {
    Object.assign(this, options)
    this.init()
  }

  init() {
    parts.forEach(p => {
      this[p.name].setSteps(p.steps)
    })
  }

  setPosition(t) {
    this.position = t
    this._moveJoints()
  }

  _moveJoints() {
    this.hip.setPosition(this.position.hip)
    this.femur.setPosition(this.position.femur)
    this.knee.setPosition(this.position.knee)
  }
}

module.exports = Leg
