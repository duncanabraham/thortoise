const fs = require('fs')
const crypto = require('crypto')
const { cryptography } = require('../config')
const { encrypt, decrypt } = require('./encrypt')
const log = require('../../../lib/log')

class ApiKeyDatabase {
  constructor () {
    this.keys = {}
    this.loadDatabase()
  }

  ipToKey (ip) {
    return ip.replace(/:/g, '_').replace(/\./g, '-')
  }

  isValid (ip, key) {
    const ipKey = this.ipToKey(ip)
    return this.keys[ipKey].key === key && !this.keys[ipKey].isExpired()
  }

  issue (ip) {
    ip = this.ipToKey(ip)
    this.keys[ip] = new ApiKey()
    this.saveDatabase()
    return this.keys[ip]
  }

  refresh (ip, currentApiKey) {
    ip = this.ipToKey(ip)
    if ((currentApiKey + '').indexOf('null') > -1) {
      return this.issue(ip)
    }
    const storedKeyInfo = this.keys[ip]
    if (storedKeyInfo && storedKeyInfo.key === currentApiKey) {
      this.keys[ip] = new ApiKey()
      this.saveDatabase()
      return this.keys[ip]
    }
    return null
  }

  saveDatabase () {
    let data = JSON.stringify(this.keys)
    if (cryptography.secure === true) {
      data = encrypt(data)
    }
    fs.writeFileSync('apiKeyDatabase.json', data)
  }

  loadDatabase () {
    try {
      let data = fs.readFileSync('apiKeyDatabase.json', 'utf8')
      if (cryptography.secure === true) {
        data = decrypt(data)
      }
      this.keys = JSON.parse(data)
    } catch (e) {
      if (e.code === 'ENOENT') {
        log.info('No Key Database. Creating.')
        fs.writeFileSync('apiKeyDatabase.json', '{}')
      }
    }
  }
}

class ApiKey {
  constructor () {
    this.key = crypto.randomBytes(20).toString('hex')
    this.expiry = Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
  }

  isExpired () {
    return Date.now() > this.expiry
  }
}

module.exports = ApiKeyDatabase
