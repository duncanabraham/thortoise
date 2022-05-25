// const { Pos } = require('./lib/pos')

const Leg = require('./lib/leg')

const JohnnyDriver = require('./lib/mockJohnny')
const driver = new JohnnyDriver() // allows direct communication with the hardware

const init = async () => {
  await driver.initBoard() // wait for the board to initialise before we use it
}

init()

// const position = new Pos(
//   30,
//   60,
//   90,
//   'test',
//   0,
//   100,
//   100
// )

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
  femurLength: 155,
  tibiaLength: 155,
  driver,
  hipServoSettings: servoSettings,
  femurServoSettings: { ...servoSettings, startAt: 50 },
  kneeServoSettings: { ...servoSettings, startAt: 75 }
}
const thisLeg = new Leg({ ...legConfig, id: 0, name: 'front-left', startPos: 0 })

const steps = 72
// const stepSize = (Math.PI * 2) / steps
// const radius = 100

const run = async () => {
  for (let step = 0; step < steps; step++) {
    // const centreX = position.footPosition
    // const centreY = position.groundClearance * 0.75
    // const a = Math.sin(step * stepSize) * radius
    // const b = Math.cos(step * stepSize) * radius
    // const t1 = centreX + a
    // const t2 = centreY + b
    // const t3 = 0
    // const posAngles = new Triplet(t1, t2, t3)
    // const angles = anglesFromPosition(posAngles, radius)

    thisLeg.nextStep(step)
    await delay(10)
  }
}

run()
