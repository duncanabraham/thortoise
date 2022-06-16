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
const servosFront = {
  hipServoSettings: { range: [40, 90], startAt: 90, sleepAt: 0, controller: 'PCA9685' },
  femurServoSettings: { range: [10, 180], startAt: 120, sleepAt: 0, controller: 'PCA9685' },
  kneeServoSettings: { range: [10, 180], startAt: 90, sleepAt: 0, controller: 'PCA9685' }
}

const servosBack = {
  hipServoSettings: { range: [100, 150], startAt: 90, sleepAt: 0, controller: 'PCA9685' },
  femurServoSettings: { range: [10, 180], startAt: 120, sleepAt: 0, controller: 'PCA9685' },
  kneeServoSettings: { range: [10, 180], startAt: 90, sleepAt: 0, controller: 'PCA9685' }
}

const legSettings = [
  { id: 0, name: 'front-left', startPos: 0, ...legDefaults, ...servosFront },
  { id: 1, name: 'front-right', startPos: Math.PI / 2, ...legDefaults, ...servosFront },
  { id: 2, name: 'back-left', startPos: Math.PI, ...legDefaults, ...servosBack },
  { id: 3, name: 'back-right', startPos: Math.PI * 1.5, ...legDefaults, ...servosBack }
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
