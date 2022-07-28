module.exports = {
  openSync: () => ({
    readByteSync: () => { return 0 },
    writeByteSync: () => {},
    writeWordSync: () => {},
    closeSync: () => {},
    readWordSync: () => { return 0 },
    _writeWordLH: () => {}
  })
}
