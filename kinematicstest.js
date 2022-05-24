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
for (let tick = 0; tick < 72; tick++) {
  position.setAngles(kineMove(position, tick))
  const { t1, t2, t3 } = position
  console.log(`${t2}, ${t3}`)
}
