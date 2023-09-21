const ExternalDevice = require('../externaldevice')

const featureOptions = {
  type: 'CORE',
  group: 'SYSTEM',
  resumeHandler: () => { },
  pauseHandler: () => { }
}
class ICM20948 extends ExternalDevice{
  constructor(options = {name: 'ICM20948', channel: 'ICM20948_data'}){
    super(options, featureOptions)
  }

  /**
   * override default method with data formatting specific to this device
   */
  get lastResult() {
    console.log('ICM20948: lastData: ', this.lastData)
    return this.lastData
  }
}

module.exports = ICM20948
