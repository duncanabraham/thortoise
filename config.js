require('dotenv').config()
const { version } = require('./package.json')

const legDefaults = {
  femurLength: 150,
  tibiaLength: 150,
  hipServoSettings: this.hipServo,
  femurServoSettings: this.femurServo,
  kneeServoSettings: this.kneeServo,
  direction: 'forward'
}

const env = {
  ...process.env
}

const servos = {
  hipServoSettings: { range: [40, 90], startAt: 90, controller: 'PCA9685' },
  femurServoSettings: { range: [20, 120], startAt: 120, controller: 'PCA9685' },
  kneeServoSettings: { range: [40, 90], startAt: 90, controller: 'PCA9685' }
}

const legSettings = [
  { id: 0, name: 'front-left', startPos: 0, ...legDefaults, ...servos },
  { id: 1, name: 'front-right', startPos: Math.PI / 2, ...legDefaults, ...servos },
  { id: 2, name: 'back-left', startPos: Math.PI, ...legDefaults, ...servos },
  { id: 3, name: 'back-right', startPos: Math.PI * 1.5, ...legDefaults, ...servos }
]

const options = {
  name: 'ThortBot',
  version
}

module.exports = {
  env,
  legSettings,
  options
}
