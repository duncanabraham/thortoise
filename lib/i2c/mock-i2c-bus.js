const Random = require('random-js').Random
const random = new Random()

module.exports = {
  openSync: () => ({
    readByteSync: () => { return random.integer(0, 255) },
    writeByteSync: () => {},
    writeWordSync: (address, register, value) => ({ address, register, value: value.toString(16).toUpperCase() }),
    closeSync: () => {},
    readWordSync: () => { return 0 }
  })
}
