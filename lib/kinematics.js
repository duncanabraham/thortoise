const { Triplet } = require('./triplet')

/**
 * Calculate the position in space of the foot given the limb lengths and joint angles
 * @param {Triplet} t - angles of joints Hip, Femur and Knee
 * @param {*} femurLength - how long is the upper limb 
 * @param {*} tibiaLength - how long is the lower limb 
 * @returns 
 */
const xyz = (t, femurLength, tibiaLength) => {
  const toRad = t.toRad
  const { t1: Q1, t2: Q2 } = t.toRadians()
  const { t2, t3 } = t
  const d2 = 0
  const Q4 = 180 - t2 - 90
  const Q5 = t3 - Q4
  const d3 = femurLength * Math.sin(Q2)
  const d6 = tibiaLength * Math.cos(toRad(Q5))
  const z = d2 + d3 - d6
  const d4 = femurLength * Math.cos(Q2)
  const d5 = tibiaLength * Math.sin(toRad(Q5))
  const d1 = d4 + d5
  const x = d1 * Math.cos(Q1)
  const y = d1 * Math.sin(Q1)
  return new Triplet(x, y, z)
}

const nextPos = (step, tibiaLength, xyz) => {
  const { t1: x, t2: y, t3: z } = xyz
  const radius = (tibiaLength / 2)
  const a = (Math.sin(step) * radius)
  const b = (Math.cos(step) * radius)
  return new Triplet(x + a, y + b, z)
}

const anglesFromPosition = (xyz, t1, femurLength, tibiaLength) => {
  const { t1: x, t2: y, t3: z } = xyz
  const toDeg = xyz.toDeg
  const xSqrd = x * x
  const ySqrd = y * y
  const L1Sqrd = femurLength * femurLength
  const L2Sqrd = tibiaLength * tibiaLength

  const Q2 = Math.cos((xSqrd + ySqrd - L1Sqrd - L2Sqrd) / (2 * femurLength * tibiaLength))
  const Q1 = Math.atan(y/x) - Math.atan((tibiaLength * Math.sin(Q2)) / (femurLength + tibiaLength * Math.cos(Q2)))
  return new Triplet(t1, toDeg(Q1), toDeg(Q2))
}

/**
 * Calculate the angles to move the joints to make the foot move to the next position
 * @param {Triplet} t - angles of joints Hip, Femur and Knee
 * @param {*} startPoint - this limb should move at an offset from the other limbs
 * @param {*} ticks - how many steps make a full turn
 * @param {*} tick - which step are we on at the moment
 * @param {*} femurLength - how long is the upper limb
 * @param {*} tibiaLength - how long is the lower limb
 */
const cw = (t, startPoint, ticks, tick, femurLength, tibiaLength) => {
  const { t1 } = t
  const stepSize = (Math.PI * 2) / ticks
  const step = tick * stepSize + startPoint
  const position = xyz(t, femurLength, tibiaLength) // work out where the foot is now
  const newPos = nextPos(step, tibiaLength, position)
  const newAngles = anglesFromPosition(newPos, t1, femurLength, tibiaLength)
  return newAngles.rounded()
}

const ccw = (t, startPoint, ticks, tick, femurLength, tibiaLength) => {

}

module.exports = {
  cw,
  ccw,
  xyz,
  nextPos
}
