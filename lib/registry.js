class Registry {
  constructor (options) {
    Object.assign(this, options)
    this._registry = {}
  }

  __getType (type) {
    return type in this._registry ? this._registry[type] : (this._registry[type] = {})
  }

  __getFolder (rootFolder, group) {
    return group in rootFolder ? rootFolder[group] : (rootFolder[group] = {})
  }

  _itemByNameRecursive (name, obj) {
    if (obj.name === name) {
      return obj
    }
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        const found = this._itemByNameRecursive(name, obj[key])
        if (found) {
          return found
        }
      }
    }
    return null
  }

  itemByName (name) {
    return this._itemByNameRecursive(name, this._registry)
  }

  register (feature) {
    const folder = this.__getFolder(this.__getType(feature.type), feature.group)
    folder[feature._id] = feature
  }

  lowPowerMode () {
    const types = Object.keys(this._registry).filter(k => k !== 'CORE')
    for (const type of types) {
      const features = Object.keys[this._registry[type]]
      features.forEach(thisFeature => thisFeature.pause())
    }
  }

  wakeAll () {
    const types = Object.keys(this._registry).filter(k => k !== 'CORE')
    for (const type of types) {
      const features = Object.keys[this._registry[type]]
      features.forEach(thisFeature => thisFeature.resume())
    }
  }

  export () {
    return this._registry
  }
}

module.exports = Registry
