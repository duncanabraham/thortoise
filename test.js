
const { Board, Servo } = require('johnny-five')
const Raspi = require('raspi-io').RaspiIO
const board = new Board({
  io: new Raspi()
})
const controller = 'PCA9685'

const a = new Servo({ // hip
  controller,
  range: [40, 90],
  pin: 0
})

const b = new Servo({ // femur
  controller,
  range: [20, 120],
  pin: 1
})

const c = new Servo({ // knee
  controller,
  range: [40, 90],
  pin: 2
})

const servos = [a, b, c]

const loadBoard = () => {
  return new Promise(resolve => {
    board.on('ready', resolve)
  })
}

board.on('exit', () => {
  for (const servo of servos) {
    servo.stop()
  }
  console.log('Stopped')
})

const main = async () => {
  await loadBoard()
  console.log('Connected')

  for (const servo of servos) {
    servo.sweep()
  }
}

main()
