// const { Pos } = require('./lib/pos')

const Leg = require('./lib/leg')

const JohnnyDriver = require('./lib/johnnyDriver')
const driver = new JohnnyDriver() // allows direct communication with the hardware

const init = async () => {
  await driver.initBoard() // wait for the board to initialise before we use it
}

init()

const delay = (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const servoSettings = {
  range: [20, 160],
  startAt: 45,
  controller: 'PCA9685'
}

const legConfig = {
  femurLength: 110,
  tibiaLength: 110,
  driver,
  hipServoSettings: servoSettings,
  femurServoSettings: { ...servoSettings, startAt: 50 },
  kneeServoSettings: { ...servoSettings, startAt: 75 }
}
const thisLeg = new Leg({ ...legConfig, id: 0, name: 'front-left', startPos: 0 })

const steps = 72

let step = 0
const run = async () => {
  thisLeg.nextStep(step)
  step++
  if (step === steps) { step = 0 }
}

setInterval(run, 500)
