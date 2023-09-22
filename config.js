require('dotenv').config()
const { version } = require('./package.json')
const path = require('path')

// const legDefaults = {
//   femurLength: 115,
//   tibiaLength: 130,
//   hipServoSettings: this.hipServo,
//   femurServoSettings: this.femurServo,
//   kneeServoSettings: this.kneeServo,
//   direction: 'stopped'
// }

const env = {
  ...process.env
}

// https://components101.com/motors/mg996r-servo-motor-datasheet- max angle 180 degrees however I've measured it (roughly) at 200 degrees
// const servosFrontLeft = { // calibrated
//   hipServoSettings: { pin: 0, range: [10, 20], startAt: 10, sleepAt: 10, standAt: 10 }, // done
//   femurServoSettings: { pin: 1, range: [90, 200], startAt: 90, sleepAt: 90, standAt: 90 },
//   kneeServoSettings: { pin: 2, range: [30, 200], startAt: 120, sleepAt: 120, standAt: 120 }
// }

// const servosFrontRight = { // calibrated
//   hipServoSettings: { pin: 3, range: [170, 180], startAt: 180, sleepAt: 180, standAt: 180 },
//   femurServoSettings: { pin: 4, range: [10, 80], startAt: 80, sleepAt: 80, standAt: 80 },
//   kneeServoSettings: { pin: 5, range: [10, 80], startAt: 80, sleepAt: 80, standAt: 80 }
// }

// const servosBackLeft = {
//   hipServoSettings: { pin: 6, range: [0, 210], startAt: 200, sleepAt: 200, standAt: 200 },
//   femurServoSettings: { pin: 7, range: [0, 180], startAt: 150, sleepAt: 150, standAt: 150 },
//   kneeServoSettings: { pin: 8, range: [0, 180], startAt: 120, sleepAt: 120, standAt: 120 }
// }

// const servosBackRight = {
//   hipServoSettings: { pin: 9, range: [5, 15], startAt: 10, sleepAt: 10, standAt: 10 },
//   femurServoSettings: { pin: 10, range: [0, 220], startAt: 35, sleepAt: 35, standAt: 35 },
//   kneeServoSettings: { pin: 11, range: [0, 180], startAt: 100, sleepAt: 100, standAt: 100 }
// }

// const legSettings = [
//   { id: 0, name: 'front-left', startPos: 0, ...legDefaults, ...servosFrontLeft },
//   { id: 1, name: 'front-right', startPos: Math.PI / 2, ...legDefaults, ...servosFrontRight },
//   { id: 2, name: 'back-left', startPos: Math.PI, ...legDefaults, ...servosBackLeft },
//   { id: 3, name: 'back-right', startPos: Math.PI * 1.5, ...legDefaults, ...servosBackRight }
// ]

// fPin and bPin are pins not GPIO numbers
// const wheelSettings = {
//   frontLeft: { speedChannel: 0, fPin: 7, bPin: 11 }, // GPIOAO_3 & GPIOAO_2
//   frontRight: { speedChannel: 1, fPin: 13, bPin: 19 }, // GPIOX_11 &  GPIOH_4
//   backLeft: { speedChannel: 2, fPin: 21, bPin: 23 }, // GPIOH_5 & GPIOH_7
//   backRight: { speedChannel: 3, fPin: 35, bPin: 37 } // GPIOAO_8 & GPIOAO_9
// }

const odriveSettings = {
  BANDWIDTH: 100,
  ENCODER_CPR: 4000,
  CURRENT_LIMIT: 20,
  VEL_LIMIT: 200,
  VEL_GAIN: 0.05,
  POS_GAIN: 0.5,
  INTEGRATOR: 0.007
}

const trackApiSettings = {
  address: '127.0.0.1',
  port: 3010
}

const options = {
  name: 'Thortoise',
  version,
  trackApiSettings,
  verbose: env.VERBOSE === 'true',
  dimensions: { // measure these, the navigation module will need to work out if it fits through/between/under a gap or obstacle
    width: 500,
    height: 400,
    length: 500
  }
}

const api = {
  port: 3000
}

const navigationSettings = { // each square on the grid represents a 500x500mm square in the real world
  gridWidth: 500,
  gridLength: 500,
  length: 9, 
  width: 9, 
  startX: 5, 
  startY: 5 
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
  odriveSettings,
  ATCOMMANDS
}
