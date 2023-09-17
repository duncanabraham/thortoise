/*
exports = global
*/

const log = require('./lib/log')

global.registry = {
  register: () => { }
}

global.app = {
  log
}
const remote = require('./lib/remote')
global.app.remote = remote

const WebSocket = require('ws')
const http = require('http')
const express = require('express')
const path = require('path') // Add this line
const app = express()
const bodyParser = require('body-parser')
const dataHandler = require('./lib/dataHandler')

// will be determined by the state of a GPIO pin to ensure the raspberry pi is connected
// if not then the motors are not allowed to move
global.connected = true

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const activeSessions = new Set()

const sendDataToClient = async (client) => {
  const status = await remote.getStatus()
  client.send(JSON.stringify({
    timestamp: new Date(),
    left: remote.motors.left,
    right: remote.motors.right,
    odrv: remote.odrv,
    status
  }))
}

wss.on('connection', (ws) => {
  // Close all active sessions, we just want 1
  activeSessions.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close()
    }
    activeSessions.delete(ws)
  })

  activeSessions.add(ws)
  sendDataToClient(ws)

  log.info('Client connected')

  ws.on('message', (message) => {
    const data = JSON.parse(message)
    log.info('message: ', data)
    if (data.code) {
      switch (data.code) {
        case 'ES':
          log.info('Emergency Stop / Reset')
          remote.stop()
          break
        default:
          log.info(`Do what?  ${data.code}`)
      }
    }
    if (global.connected) { // This section sets the speed
      remote.setSpeed('left', data.leftMotor)
      remote.setSpeed('right', data.rightMotor)
    }
    remote.setStatus({ ...data, connected: global.connected })

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        sendDataToClient(client)
      }
    })
  })

  ws.on('error', () => {
    ws.close()
  })

  ws.on('close', () => {
    log.info('Client disconnected')
    remote.stop()
    activeSessions.delete(ws)
  })
})

// Define an end point for external control over http
app.post('/data', dataHandler)

// Start the HTTP server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  log.info(`Thortoise listening on port ${PORT}`)
})
