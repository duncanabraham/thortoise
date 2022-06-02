const ExternalDevice = require('./externaldevice')

class Gps extends ExternalDevice {
  constructor(options) {
    super(options)
    this.name = 'GPS'
  }

  /**
   * Read location from the GPS device
   */
  readLocationRequest() {
    // I don't have a node module for the Waveshare GPRS module but I do have a python example
    // TODO: shoot a request off to a message queue to get an external module to read the GPS details
  }
}

module.exports = Gps
