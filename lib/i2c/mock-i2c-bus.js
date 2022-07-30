const Random = require('random-js').Random
const random = new Random()

module.exports = {
  openSync: () => ({
    readByteSync: () => { return random.integer(0, 255) },
    writeByteSync: () => {},
    writeWordSync: () => {},
    closeSync: () => {},
    readWordSync: () => { return 0 },
    _writeWordLH: () => {}
  })
}
