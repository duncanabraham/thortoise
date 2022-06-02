/**
 * Push values into the store and access them from any module that the store has been shared with
 */
class Store {
  constructor() {
    this.store = {}
    this.handlers = {}
  }

  attachHandler(key, handler) {
    this.handlers[key] = handler
  }

  detachHandler(key) {
    if (key in this.handlers) {
      delete this.handlers[key]
    }
  }

  append(key, value) { // can only append to an array
    if (!(key in this.store)) {
      this.store[key] = []
    }
    if (key in this.store && Array.isArray(this.store[key])) {
      this.store[key].push(value)
      if (key in this.handlers) {
        this.handlers[key]({ key, value, time: new Date() })
      }
    }
  }

  set(key, value) {
    this.store[key] = value
    if (key in this.handlers) {
      this.handlers[key]({ key, value, time: new Date() })
    }
  }

  get(key) {
    return this.store[key]
  }

  clear(key) {
    if (key in this.store) {
      delete this.store[key]
    }
  }

  clearAll() {
    this.store = {}
  }
}

module.exports = Store
