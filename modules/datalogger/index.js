const express = require('express')
const bodyParser = require('body-parser')
const log = require('../../lib/log')

const { server } = require('./config')
const db = require('./lib/database')

const ApiKeyDatabase = require('./lib/keystore')
const keyDatabase = new ApiKeyDatabase()

const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Generate API key
app.get('/api/key-issue', (req, res) => {
  const ip = req.ip
  const newKeyInfo = keyDatabase.issue(ip)
  const data = { apiKey: newKeyInfo.key, expiry: newKeyInfo.expiry }
  log.info('issue', data)
  res.send(data)
})

app.get('/api/key-refresh', (req, res) => {
  const ip = req.ip
  const currentApiKey = req.headers['x-api-key']
  const newKeyInfo = keyDatabase.refresh(ip, currentApiKey)

  if (newKeyInfo) {
    const data = { newApiKey: newKeyInfo.key, expiry: newKeyInfo.expiry }
    log.info('refresh', data)
    res.send(data)
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
})

// Middleware for API key verification
const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  const ip = req.ip

  if (!keyDatabase.isValid(ip, apiKey)) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  next()
}

// Protected route
app.post('/api/odometry', verifyApiKey, (req, res) => {
  // Handle odometry data here
  db.write(req.body)
  log.info('data', req.body)
  res.send({ message: 'Odometry data received.' })
})

app.listen(server.port, () => {
  log.info(`Server running on http://${server.host}:${server.port}/`)
})
