/**
 * Push values into the store and access them from any module that the store has been shared with
 */
class Store {
  constructor() {
    this.store = {}
    this.handlers = {}
  }

  /**
   * It takes a key and a handler, and then it adds the handler to the handlers object, using the key as
   * the key
   * @param key - The key that will be used to identify the handler.
   * @param handler - The function that will be called when the event is triggered.
   */
  attachHandler(key, handler) {
    this.handlers[key] = handler
  }

  /**
   * It removes the handler for the given key from the handlers object
   * @param key - The key to the handler.
   */
  detachHandler(key) {
    if (key in this.handlers) {
      delete this.handlers[key]
    }
  }

  /**
   * If the key is in the store and the value is an array, push the value to the array and call the
   * handler function
   * @param key - the key to append to
   * @param value - the value to be stored
   */
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

  /**
   * It sets the value of the key in the store and then calls the handler function if there is one
   * @param key - The key to set the value for.
   * @param value - The value to be stored in the cache.
   */
  set(key, value) {
    this.store[key] = value
    if (key in this.handlers) {
      this.handlers[key]({ key, value, time: new Date() })
    }
  }

  /**
   * It returns the value of the key in the store
   * @param key - The key of the item you want to get.
   * @returns The value of the key in the store.
   */
  get(key) {
    return this.store[key]
  }

  /**
   * If the key is in the store, delete it.
   * @param key - The key to clear.
   */
  clear(key) {
    if (key in this.store) {
      delete this.store[key]
    }
  }

  /**
   * It clears the store
   */
  clearAll() {
    this.store = {}
  }
}

module.exports = Store
