const log = require('./log')
const Feature = require('./feature')
class ExternalDevice extends Feature {
  constructor (options, featureOptions) {
    if (!options.name || !options.channel) {
      console.error('Device details:', options)
      console.error('must contain a name and a channel name to subscribe to')
      throw new Error('Invalid device options')
    }
    super({ ...featureOptions, ...options, redisClient: undefined })
    this.lastData = {}
    this.ready = false
    log.info(`register: ${options.name} on channel: ${options.channel}`)
    options.redisClient.subscribe(options.channel, this._subHandler.bind(this))
  }

  get lastResult () {
    return this.lastData
  }

  get hasData () {
    return Object.keys(this.lastData).length > 0
  }

  async _subHandler (channel, message) {
    console.log(`externalDevice: chn: ${channel}   msg: ${message}`)
    this.lastData = { ...JSON.parse(message), time: Date.now() }
  }
}

module.exports = ExternalDevice
