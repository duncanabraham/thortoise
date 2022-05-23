const { move: kineMove } = require('./lib/kinematics')
const { Pos } = require('./lib/pos')
const { pad } = require('./lib/utils')

let tick = 0
let stepSize = Math.PI / 18 // 36 steps in a circle

const position = new Pos(
  0,
  0,
  0,
  'test',
  0,
  100,
  100
)

console.log('position: ', position)
const { t1, t2, t3 } = position
console.log(pad('Test: ', 12, false), pad(t1, 6), pad(t2, 6), pad(t3, 6))
for (let tick = 0; tick < 72; tick++) {
  position.setAngles(kineMove(position, tick))
  const { t1, t2, t3 } = position
  console.log(`${t2}, ${t3}`)
}
