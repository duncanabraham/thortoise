/**
 * Build up odom data then write it on the heartbeat cycle and clear it down
 */
class Odometry {
  constructor (options = {}) {
    Object.assign(this, options)
  }

  add (options) {
    Object.assign(this, options)
  }

  clear () {
    Object.keys(this).forEach(key => {
      delete this[key]
    })
  }

  send () {
    return JSON.stringify(this)
  }
}

module.exports = Odometry
