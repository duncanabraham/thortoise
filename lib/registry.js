/**
 * A Sensor Registry for all devices that have been instantiated. This registry is global allowing access
 * to sensor data from anywhere in the system.
 *
 * Devices can be placed in low power mode by calling their pause() method and woken by calling resume()
 */
class Registry {
  constructor (options) {
    Object.assign(this, options)
    this._registry = []
    this._globals = {}
  }

  addGlobal (name, func) {
    this._globals[name] = func
  }

  itemByid (id) {
    return this._registry.find(item => item._id === id)
  }

  itemByName (name) {
    return this._registry.find(item => item.name === name)
  }

  itemByDeviceType (typeString) {
    return this._registry.filter(item => item.constructor?.name === typeString)
  }

  register (feature) {
    this._registry.push(feature)
  }

  lowPowerMode () {
    const features = Object.keys(this._registry).filter(k => k !== 'CORE')
    features.forEach(thisFeature => thisFeature.pause())
  }

  wakeAll () {
    const features = Object.keys(this._registry).filter(k => k !== 'CORE')
    features.forEach(thisFeature => thisFeature.resume())
  }

  export () {
    return this._registry
  }
}

module.exports = Registry
