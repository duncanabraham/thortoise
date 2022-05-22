const { Triplet } = require('./triplet')

/**
 * Calculate the position in space of the foot given the limb lengths and joint angles
 * @param {Pos} thisPos contains the current angles and the limb lengths in Degrees
 * @returns Triplet x,y and z positions in Degrees
 */
const calculateXyz = (thisPos) => {
  const toRad = thisPos.toRad
  const { t1: Q1, t2: Q2 } = thisPos.toRadians()
  const { t2, t3 } = thisPos
  const d2 = 0
  const Q4 = 180 - t2 - 90
  const Q5 = t3 - Q4
  const d3 = thisPos.femurLength * Math.sin(Q2)
  const d6 = thisPos.tibiaLength * Math.cos(toRad(Q5))
  const z = d2 + d3 - d6
  const d4 = thisPos.femurLength * Math.cos(Q2)
  const d5 = thisPos.tibiaLength * Math.sin(toRad(Q5))
  const d1 = d4 + d5
  const x = d1 * Math.cos(Q1)
  const y = d1 * Math.sin(Q1)
  const xyz = new Triplet(x, y, z)
  return xyz.rounded()
}

/**
 * Calculate the next position to move to
 * @param {Triplet} xyz position
 * @param {number} step in radians 
 * @param {integer} tibiaLength 
 * @returns Triplet xyz position
 */
const nextPos = (xyz, step, tibiaLength) => {
  const { t1: x, t2: y, t3: z } = xyz
  const radius = (tibiaLength / 2)
  const a = (Math.sin(step) * radius)
  const b = (Math.cos(step) * radius)
  return new Triplet(x + a, y + b, z)
}

/**
 * Calculate angles from an x,y position
 * @param {Triplet} position 
 * @param {number} Q1 
 * @param {integer} femurLength 
 * @param {integer} tibiaLength 
 * @returns Triplet Angles
 */
const anglesFromPosition = (position, Q1, femurLength, tibiaLength) => {
  const { t1: x, t2: y } = position
  const toDeg = position.toDeg
  const xSqrd = x * x
  const ySqrd = y * y
  const L1Sqrd = femurLength * femurLength
  const L2Sqrd = tibiaLength * tibiaLength
  const Q3 = Math.acos((L1Sqrd + L2Sqrd - xSqrd - ySqrd) / (2 * femurLength * tibiaLength))
  const a2_sin_q3 = tibiaLength * Math.sin(Q3)
  const a2_cos_q3 = tibiaLength * Math.cos(Q3)
  const Q2 = Math.atan(y / x) - Math.atan(a2_sin_q3 / (femurLength + a2_cos_q3))
  return new Triplet(Q1, toDeg(Q2), toDeg(Q3))
}

/**
 * Calculate the angles to move the joints to make the foot move to the next position
 * @param { Pos } thisPos - angles of joints Hip, Femur and Knee as well as limb lengths and start position
 * @param {integer} ticks - how many steps make a full turn
 * @param {integet} tick - which step are we on at the moment
 * @returns Triplet containing the new angles
 */
const move = (thisPos, ticks, tick) => {
  const { t1 } = thisPos
  const stepSize = (Math.PI * 2) / ticks
  const step = tick * stepSize + thisPos.startPos
  const position = calculateXyz(thisPos) // work out where the foot is now
  const newPos = nextPos(position, step, thisPos.tibiaLength) // returns a triplet
  const newAngles = anglesFromPosition(newPos, t1, thisPos.femurLength, thisPos.tibiaLength)
  return newAngles.rounded()
}

module.exports = {
  move,
  calculateXyz,
  nextPos,
  anglesFromPosition
}
