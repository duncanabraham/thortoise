const WebSocket = require('ws')
const http = require('http')
const express = require('express')
const path = require('path') // Add this line
const app = express()

const ODrive = require('../lib/odrive')
const uart = '/dev/ttyAML1' // /dev/ttyAML0 = Radxa UART_A, /dev/ttyAML1 = Radxa UART_B
const baud = 115200

const motorController = new ODrive(uart, baud)
const maxSpeed = 16
let runState = 0

const setSpeed = async (motor, speed) => {
  if (!runState) {
    await motorController.write('w axis0.requested_state 8\n')
    await motorController.write('w axis1.requested_state 8\n')
    runState = 1
  }
  motors[motor].setSpeed = speed
  const adjustedSpeed = (maxSpeed / 100) * speed
  switch (motor) {
    case 'left':
      await motorController.write(`w axis0.controller.input_vel ${adjustedSpeed}\n`)
      break
    case 'right':
      await motorController.write(`w axis1.controller.input_vel ${adjustedSpeed}\n`)
      break
  }
}

const stop = async () => {
  await setSpeed('left', 0)
  await setSpeed('right', 0)
  // Set the MC to idle mode
  await motorController.write('w axis0.requested_state 1\n')
  await motorController.write('w axis1.requested_state 1\n')
  runState = 0
}

const init = async () => {
  await motorController.init()
  await motorController.calibrate()
  await stop()
}

init()

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const motors = {
  left: {
    setSpeed: 0,
    velocity: 0,
    position: 0,
    mechanical: 0,
    electrical: 0
  },
  right: {
    setSpeed: 0,
    velocity: 0,
    position: 0,
    mechanical: 0,
    electrical: 0
  }
}

const odrv = {
  vbus: 0,
  ibus: 0,
  error: 'OK'
}

const activeSessions = new Set()

const sendDataToClient = (client) => {
  client.send(JSON.stringify({ timestamp: new Date(), left: motors.left, right: motors.right, odrv }))
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

    setSpeed('left', data.leftMotor)
    setSpeed('right', data.rightMotor)

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
    stop()
    activeSessions.delete(ws)
  })
})

// Start the HTTP server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Thortoise listening on port ${PORT}`)
})
