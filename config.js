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

// https://components101.com/motors/mg996r-servo-motor-datasheet- max angle 180 degrees however I've measured it (roughly) at 200 degrees
const servosFrontLeft = { // calibrated
  hipServoSettings: { range: [60, 70], startAt: 65, sleepAt: 65, standAt: 65, controller: 'PCA9685' },
  femurServoSettings: { range: [30, 90], startAt: 60, sleepAt: 30, standAt: 60, controller: 'PCA9685' },
  kneeServoSettings: { range: [30, 200], startAt: 180, sleepAt: 180, standAt: 60, controller: 'PCA9685' }
}

const servosFrontRight = { // calibrated
  hipServoSettings: { range: [90, 100], startAt: 95, sleepAt: 95, standAt: 95, controller: 'PCA9685' },
  femurServoSettings: { range: [130, 210], startAt: 210, sleepAt: 210, standAt: 130, controller: 'PCA9685' },
  kneeServoSettings: { range: [30, 130], startAt: 130, sleepAt: 130, standAt: 130, controller: 'PCA9685' }
}

const servosBackLeft = {
  hipServoSettings: { range: [90, 100], startAt: 95, sleepAt: 95, standAt: 95, controller: 'PCA9685' },
  femurServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, standAt: 60, controller: 'PCA9685' },
  kneeServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, standAt: 60, controller: 'PCA9685' }
}

const servosBackRight = {
  hipServoSettings: { range: [60, 70], startAt: 65, sleepAt: 65, standAt: 65, controller: 'PCA9685' },
  femurServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, standAt: 60, controller: 'PCA9685' },
  kneeServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, standAt: 60, controller: 'PCA9685' }
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
