const { version } = require('./package.json')
const Thortoise = require('./lib/thortoise')

// Define settings for this specific servo
const mg996rServo = {
  ms: 1000,
  steps: 0.2,
  minPos: 60,
  maxPos: 120
}

const options = {
  name: 'ThortBot',
  version,
  hipServo: mg996rServo,
  femurServo: mg996rServo,
  kneeServo: mg996rServo
}

const thortBot = new Thortoise(options)

console.log('thortBot: ', thortBot)

thortBot.start()
