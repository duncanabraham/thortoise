const socket = new WebSocket('ws://thortoise/') // Adjust the WebSocket URL

socket.addEventListener('open', (event) => {
  // Connection is established
  console.log('WebSocket connection opened')
})

window.addEventListener('beforeunload', () => {
  // Close the WebSocket connection before the page is unloaded
  if (socket) {
    socket.close()
  }
})

const updateTable = (data) => {
  document.getElementById('odrvvoltage').innerHTML = data.odrv.vbus
  document.getElementById('odrvcurrent').innerHTML = data.odrv.ibus
  document.getElementById('odrverror').innerHTML = data.odrv.error

  document.getElementById('motor0vel').innerHTML = data.left.velocity
  document.getElementById('motor0pos').innerHTML = data.left.position
  document.getElementById('motor0mechanical').innerHTML = data.left.mechanical
  document.getElementById('motor0electrical').innerHTML = data.left.electrical

  document.getElementById('motor1vel').innerHTML = data.right.velocity
  document.getElementById('motor1pos').innerHTML = data.right.position
  document.getElementById('motor1mechanical').innerHTML = data.right.mechanical
  document.getElementById('motor1electrical').innerHTML = data.right.electrical
}

socket.addEventListener('message', (event) => {
  // Handle incoming messages (telemetry data) here
  const data = JSON.parse(event.data)
  console.log('Received data:', data)

  // Display telemetry data in the scrolling panel
  const outputWindow = document.getElementById('main-window')
  updateTable(data)
  outputWindow.innerHTML = `<p>${JSON.stringify(data)}</p>` + outputWindow.innerHTML
})

socket.addEventListener('close', (event) => {
  // Connection is closed
  console.log('WebSocket connection closed')
})

let leftMotorValue = 0
let rightMotorValue = 0

const sendDataToServer = (extra) => {
  const data = {
    leftMotor: leftMotorValue,
    rightMotor: rightMotorValue,
    ...extra
  }

  socket.send(JSON.stringify(data))
}

const leftRange = document.getElementById('motor-control-left')
const leftValueDisplay = document.getElementById('motor-value-left')

const rightRange = document.getElementById('motor-control-right')
const rightValueDisplay = document.getElementById('motor-value-right')

// Update the value display when the range input changes
leftRange.addEventListener('input', () => {
  const value = leftRange.value
  updateLeftMotorValue(value)
})

rightRange.addEventListener('input', () => {
  const value = rightRange.value
  updateRightMotorValue(value)
})

const esbtn = document.getElementById('esbtn')
esbtn.addEventListener('click', () => {
  rightRange.value = 0
  leftRange.value = 0
  leftMotorValue = 0
  rightMotorValue = 0
  sendDataToServer({ code: 'ES' })
  updateLeftMotorValue(0)
  updateRightMotorValue(0)
})

// Function to update the left motor value
function updateLeftMotorValue (value) {
  leftMotorValue = value * -1
  leftValueDisplay.textContent = `${leftMotorValue}%`
  sendDataToServer()
}

function updateRightMotorValue (value) {
  rightMotorValue = value * -1
  rightValueDisplay.textContent = `${rightMotorValue}%`
  sendDataToServer()
}
