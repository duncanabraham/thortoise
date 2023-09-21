const Feature = require('./feature')
class ExternalDevice extends Feature {
  constructor(options, featureOptions) {
    if (!options.name || !options.channel) {
      console.error('Device details:', options)
      console.error('must contain a name and a channel name to subscribe to')
      throw new Error('Invalid device options')
    }
    super({ ...featureOptions, options })
    this.lastData = {}
    this.ready = false
    console.log(`register: ${options.name} on channel: ${options.channel}`)
    console.log('externalDevice: redisClient: ', redisClient)
    options.redisClient.subscribe(options.channel, (channel, message) => {
      console.log(`main: chn: ${channel}   msg: ${message}`)      
    })
  }

  get lastResult() {
    return this.lastData
  }

  get hasData() {
    return Object.keys(this.lastData).length > 0
  }

  async _queueReader(channel, message) {
    console.log(`chn: ${channel}   msg: ${message}`)
    this.lastData = { ...JSON.parse(message), time: Date.now() }
  }
}

module.exports = ExternalDevice
