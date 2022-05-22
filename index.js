const { version } = require('./package.json')
const Thortoise = require('./lib/thortoise')

// Define settings for this specific servo
const hipMg996rServo = {
  range: [40, 90],
  startAt: 90
}

const femurMg996rServo = {
  range: [20, 120],
  startAt: 120
}

const kneeMg996rServo = {
  range: [40, 90],
  startAt: 90
}

const options = {
  name: 'ThortBot',
  version,
  hipServo: hipMg996rServo,
  femurServo: femurMg996rServo,
  kneeServo: kneeMg996rServo
}

const thortBot = new Thortoise(options)

console.log('thortBot: ', thortBot)

thortBot.start()
