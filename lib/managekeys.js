const HttpClient = require('./webtalk')

const httpClient = new HttpClient()
const serverUrl = 'http://127.0.0.1:3050'

class ApiKey {
  constructor () {
    this.apiKey = null
    this.apiKeyExpiry = null
  }

  async issueApiKey () {
    try {
      const response = await httpClient.get(`${serverUrl}/api/key-issue`)
      const data = JSON.parse(response.data)
      this.apiKey = data.apiKey
      this.apiKeyExpiry = data.expiry
    } catch (err) {
      console.error('Error issuing API key:', err)
    }
  }

  async refreshApiKey () {
    try {
      const response = await httpClient.get(`${serverUrl}/api/key-refresh`, {
        'x-api-key': this.apiKey
      })
      if (response.data?.message === 'Unauthorized') {
        const err = 'unauthorised request to data logging server'
        console.error(err)
        return new Error(err)
      }
      const data = JSON.parse(response.data)
      this.apiKey = data.newApiKey
      this.apiKeyExpiry = data.expiry
    } catch (err) {
      console.error('Error refreshing API key:', err)
    }
  }

  isApiKeyExpired () {
    return Date.now() > this.apiKeyExpiry
  }
}

module.exports = ApiKey
