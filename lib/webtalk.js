const http = require('http')
const https = require('https')
const { URL } = require('url')

class HttpClient {
  _performRequest (url, options, data = null) {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url)
      const isHttps = parsedUrl.protocol === 'https:'

      const requestOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search, // Include search parameters
        method: options.method,
        headers: options.headers
      }

      const req = (isHttps ? https : http).request(requestOptions, res => {
        let body = ''

        res.on('data', chunk => {
          body += chunk.toString()
        })

        res.on('end', () => {
          resolve({
            data: body,
            status: res.statusCode,
            headers: res.headers
          })
        })
      })

      req.on('error', err => {
        reject(err)
      })

      if (data) {
        req.write(JSON.stringify(data))
      }

      req.end()
    })
  }

  async get (url, headers = {}) {
    // You might want to add some default headers here
    return this._performRequest(url, { method: 'GET', headers })
  }

  async post (url, data, headers = {}) {
    headers['Content-Type'] = 'application/json'
    return this._performRequest(url, { method: 'POST', headers }, data)
  }
}

module.exports = HttpClient
