// const { Pos } = require('./lib/pos')

const Leg = require('./lib/leg')

const JohnnyDriver = require('./lib/mockJohnny')
const driver = new JohnnyDriver() // allows direct communication with the hardware

const init = async () => {
  await driver.initBoard() // wait for the board to initialise before we use it
}

init()

const servoSettingsHip = {
  range: [60, 120],
  startAt: 60,
  controller: 'PCA9685'
}

const servoSettingsFemur = {
  range: [20, 160],
  startAt: 55,
  controller: 'PCA9685'
}

const servoSettingsKnee = {
  range: [20, 160],
  startAt: 75,
  controller: 'PCA9685'
}

const legConfig = {
  femurLength: 110,
  tibiaLength: 110,
  driver,
  hipServoSettings: servoSettingsHip,
  femurServoSettings: servoSettingsFemur,
  kneeServoSettings: servoSettingsKnee
}
const thisLeg = new Leg({ ...legConfig, id: 0, name: 'front-left', startPos: 0 })

const steps = 72

let step = 0
const run = async () => {
  thisLeg.nextStep(step)
  step++
  if (step === steps) { process.exit() } // step = 0 }
}

setInterval(run, 50)
