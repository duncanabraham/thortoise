require('dotenv').config()
const { version } = require('./package.json')

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

const servos = { // https://www.electronicoscaldas.com/datasheet/MG996R_Tower-Pro.pdf
  hipServoSettings: { range: [40, 90], startAt: 90, sleepAt: 0, controller: 'PCA9685' },
  femurServoSettings: { range: [10, 180], startAt: 120, sleepAt: 0, controller: 'PCA9685' },
  kneeServoSettings: { range: [10, 180], startAt: 90, sleepAt: 0, controller: 'PCA9685' }
}

const legSettings = [
  { id: 0, name: 'front-left', startPos: 0, ...legDefaults, ...servos },
  { id: 1, name: 'front-right', startPos: Math.PI / 2, ...legDefaults, ...servos },
  { id: 2, name: 'back-left', startPos: Math.PI, ...legDefaults, ...servos },
  { id: 3, name: 'back-right', startPos: Math.PI * 1.5, ...legDefaults, ...servos }
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
  output: `${__dirname}/image.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
}

module.exports = {
  env,
  options,
  api,
  navigationSettings,
  cameraSettings
}
