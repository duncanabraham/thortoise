
class Gpio {
  writeSync (v) {
    console.log('mock write: ', v)
  }

  readSync (v) {
    return v
  }
}

module.exports = {
  Gpio
}
