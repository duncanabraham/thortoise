const WebSocket = require('ws')
const http = require('http')
const express = require('express')
const path = require('path') // Add this line
const app = express()

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const leftMotor = {
  setSpeed: 0,
  velocity: 0,
  position: 0,
  mechanical: 0,
  electrical: 0
}

const rightMotor = {
  setSpeed: 0,
  velocity: 0,
  position: 0,
  mechanical: 0,
  electrical: 0
}

const odrv = {
  vbus: 0,
  ibus: 0,
  error: 'OK'
}

const activeSessions = new Set()

const sendDataToClient = (client) => {
  client.send(JSON.stringify({ timestamp: new Date(), left: leftMotor, right: rightMotor, odrv }))
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

    leftMotor.setSpeed = data.leftMotor
    rightMotor.setSpeed = data.rightMotor

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
    leftMotor.setSpeed = 0
    rightMotor.setSpeed = 0
    activeSessions.delete(ws)
  })
})

// Start the HTTP server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Thortoise listening on port ${PORT}`)
})
