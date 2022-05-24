const { version } = require('./package.json')
const Thortoise = require('./lib/thortoise')
const JohnnyDriver = require('./lib/johnnyDriver')
const driver = new JohnnyDriver() // allows direct communication with the hardware

const init = async () => {
  await driver.initBoard() // wait for the board to initialise before we use it
}

init()

// Define settings for this specific servo
const hipMg996rServo = {
  range: [40, 90],
  startAt: 90,
  controller: 'PCA9685'
}

const femurMg996rServo = {
  range: [20, 120],
  startAt: 120,
  controller: 'PCA9685'
}

const kneeMg996rServo = {
  range: [40, 90],
  startAt: 90,
  controller: 'PCA9685'
}

const options = {
  name: 'ThortBot',
  version,
  hipServo: hipMg996rServo,
  femurServo: femurMg996rServo,
  kneeServo: kneeMg996rServo,
  driver
}

const thortBot = new Thortoise(options)

console.info('thortBot: ', thortBot)

thortBot.start()
