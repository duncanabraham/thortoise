const fetch = require('node-fetch')
const { options: { trackApiSettings } } = require('../config')
console.log('trackApiSettings: ', trackApiSettings)
/**
 * API calls for talking to the Raspberry Pi PICO that accepts commands for the physical
 * tracks. The PICO will only have a POST handler to update all settings and a GET method
 * to read the status as defined in Api.py
 */
class Api {
  async write (path, data) {
    const response = await fetch(`http://${trackApiSettings.address}:${trackApiSettings.port}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const responseData = await response.json()
    return responseData
  }

  async read (query) {
    const response = await fetch(`http://${trackApiSettings.address}:${trackApiSettings.port}/${query}`)
    return response.json()
  }
}

module.exports = new Api()
