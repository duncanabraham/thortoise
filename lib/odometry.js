const { keyManagerSettings } = require('../config')
const HttpClient = require('./webtalk')
const httpClient = new HttpClient()
const ApiKey = require('./managekeys')
const keyManager = new ApiKey()
const serverUrl = keyManagerSettings.keyServerUrl
const fs = require('fs')
const log = require('./log')

/**
 * Build up odom data then write it on the heartbeat cycle and clear it down
 */
class Odometry {
  constructor (options = {}) {
    Object.assign(this, options)
    this.odomData = []
  }

  /**
   * Accept a data object containing odometry data and add it to our list. The list will be processed on a heartbeat timer event
   */
  add (data) {
    data.timeStamp = Date.now()
    this.odomData = this.odomData.concat([data])
    if (this.verbose) {
      log.info(data)
    }
    this.save()
  }

  save () {
    fs.writeFileSync('odometryData.json', JSON.stringify(this.odomData))
  }

  _removeConsecutiveDuplicates () {
    let lastItem = null
    const uniqueDataArray = []
    for (const item of this.odomData) {
      const { timeStamp, ...rest } = item
      const itemString = JSON.stringify(rest)

      if (itemString !== lastItem) {
        uniqueDataArray.push(item)
        lastItem = itemString
      }
    }
    return uniqueDataArray
  }

  async send () {
    const data = this._removeConsecutiveDuplicates()
    if (!this.sendingData && data.length && serverUrl.length) { // skip this if there's no data or we don't have a log server configured
      try {
        this.sendingData = true
        if (!keyManager.apiKey || keyManager.isApiKeyExpired()) {
          await keyManager.refreshApiKey()
        }
        const response = await httpClient.post(`${serverUrl}/api/odometry`, data, {
          'x-api-key': keyManager.apiKey
        })
        this.odomData = []
        if (this.verbose) {
          log.info('Success: data logger response: ', JSON.parse(response.data).message)
        }
      } catch (err) {
        log.error('Error sending odometry data:', err)
      } finally {
        this.sendingData = false
      }
    }
  }
}

module.exports = Odometry
