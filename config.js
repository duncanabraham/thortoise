require('dotenv').config()
const { version } = require('./package.json')
const path = require('path')

const legDefaults = {
  femurLength: 115,
  tibiaLength: 130,
  hipServoSettings: this.hipServo,
  femurServoSettings: this.femurServo,
  kneeServoSettings: this.kneeServo,
  direction: 'stopped'
}

const env = {
  ...process.env
}

// https://www.electronicoscaldas.com/datasheet/MG996R_Tower-Pro.pdf
const servosFrontLeft = {
  hipServoSettings: { range: [60, 70], startAt: 65, sleepAt: 65, controller: 'PCA9685' },
  femurServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, controller: 'PCA9685' },
  kneeServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, controller: 'PCA9685' }
}

const servosFrontRight = {
  hipServoSettings: { range: [90, 100], startAt: 95, sleepAt: 95, controller: 'PCA9685' },
  femurServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, controller: 'PCA9685' },
  kneeServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, controller: 'PCA9685' }
}

const servosBackLeft = {
  hipServoSettings: { range: [90, 100], startAt: 95, sleepAt: 95, controller: 'PCA9685' },
  femurServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, controller: 'PCA9685' },
  kneeServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, controller: 'PCA9685' }
}

const servosBackRight = {
  hipServoSettings: { range: [60, 70], startAt: 65, sleepAt: 65, controller: 'PCA9685' },
  femurServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, controller: 'PCA9685' },
  kneeServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, controller: 'PCA9685' }
}

const legSettings = [
  { id: 0, name: 'front-left', startPos: 0, ...legDefaults, ...servosFrontLeft },
  { id: 1, name: 'front-right', startPos: Math.PI / 2, ...legDefaults, ...servosFrontRight },
  { id: 2, name: 'back-left', startPos: Math.PI, ...legDefaults, ...servosBackLeft },
  { id: 3, name: 'back-right', startPos: Math.PI * 1.5, ...legDefaults, ...servosBackRight }
]

const options = {
  name: 'ThortBot',
  version,
  legSettings,
  verbose: env.VERBOSE === 'true'
}

const api = {
  port: 3000
}

const navigationSettings = {
  gridWidth: 500,
  gridLength: 500
}

const cameraSettings = {
  mode: 'photo',
  output: path.join(__dirname, 'image.jpg'),
  width: 640,
  height: 480,
  nopreview: true
}

const ATCOMMANDS = {
  status: 'AT\r'
}

module.exports = {
  env,
  options,
  api,
  navigationSettings,
  cameraSettings,
  ATCOMMANDS
}
