const { Board, Servo } = require("johnny-five")
const Raspi = require("raspi-io").RaspiIO
const board = new Board({
  io: new Raspi()
})
const controller = "PCA9685"

const easeInOutQuad = (t, b, c, d) => {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b
  return -c / 2 * ((--t) * (t - 2) - 1) + b
}

board.on("ready", async () => {
  console.log("Connected")

  const b = new Servo({
    controller,
    range: [0, 180],
    pin: 2,
  })

  const delay = (ms = 1000) => {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  let position = 0
  let originalPosition = 0
  let desiredPosition = 0
  let stepCount = 0
  let swing
  const steps = 0.04
  let totalSteps = 1 / steps

  const queue = [0,180,0,180,30,60,90,120,150,180,90,0,120,30]

  const _makeMove = () => {
    console.log(`moving from ${originalPosition} to ${desiredPosition}, currently at ${position}`)
    b.to(position)
    stepCount++
  }

  const _doStepEaseInOut = () => {
    const easedPosition = Math.floor(easeInOutQuad(stepCount, originalPosition, swing, totalSteps))
    position = easedPosition < 0 ? 0 : easedPosition > 180 ? 180 : easedPosition
    _makeMove()
  }

  const setPosition = (angle) => {
    desiredPosition = angle
    stepCount = 0
    originalPosition = position
    swing = desiredPosition - originalPosition
    const loopFunc = _doStepEaseInOut
    if (!this.timingLoop) {
      this.timingLoop = setInterval(loopFunc, 1000 * steps) // keep doing this - until stop() is called
    }
  }

  setPosition(0)
  await delay()

  const run = async () => {
    for(const q of queue) {
      setPosition(q)
      await delay()
    }
  }

  run()

})
