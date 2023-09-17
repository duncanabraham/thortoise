const WebSocket = require('ws')
const http = require('http')
const express = require('express')
const path = require('path') // Add this line
const app = express()
const remote = require('./lib/remote')
const SC16IS752 = require('../../lib/i2c/SC16IS752')
const dataHandler = require('./lib/dataHandler')

global.registry = {
  register: () => { }
}

// will be determined by the state of a GPIO pin to ensure the raspberry pi is connected
// if not then the motors are not allowed to move
global.connected = true

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')))

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

  console.log('Client connected')

  ws.on('message', (message) => {
    const data = JSON.parse(message)
    console.log('message: ', data)
    if (data.code) {
      switch (data.code) {
        case 'ES':
          console.log('Emergency Stop / Reset')
          remote.stop()
          break
        default:
          console.log(`Do what?  ${data.code}`)
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
    console.log('Client disconnected')
    remote.stop()
    activeSessions.delete(ws)
  })
})

// Define an end point for external control over http
app.get('/data', dataHandler)

// Start the HTTP server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Thortoise listening on port ${PORT}`)
})
