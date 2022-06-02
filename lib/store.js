/**
 * Push values into the store and access them from any module that the store has been shared with
 */
class Store{
  constructor() {
    this.store = {}
  }
  
  add(key, value) {
    this.store[key] = value
  }

  read(key){
    return this.store[key]
  }

  clear(key) {
    delete this.store[key]
  }

  clearAll() {
    this.store = {}
  }
}

module.exports = Store
