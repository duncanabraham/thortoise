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
 * Calculate angles from an x,y position
 * https://www.youtube.com/watch?v=Q-UeYEpwXXU
 * @param {Triplet} position
 * @param {integer} l1
 * @param {integer} l2
 * @returns Triplet Angles
 */
const anglesFromPosition = (position, upperLength) => {
  const { t1: x, t2: y, t3: z, toDeg, square } = position
  const b = toDeg(Math.atan2(y, x)) // hip angle in degrees
  const l = Math.round(Math.sqrt(square(x) + square(y)))
  const h = Math.round(Math.sqrt(square(z) + square(l)))
  const phi = toDeg(Math.atan(z / l))
  const theta = toDeg(Math.cos((h / 2) / upperLength))
  const a1 = phi + theta // femur angle
  const a2 = phi - theta // knee angle
  return new Triplet(b, a1, a2)
}

/**
 * Calculate the next position to move to
 * @param {Triplet} xyz position
 * @param {number} tick in radians
 * @param {integer} limbLength
 * @returns Triplet xyz position
 */
const nextPos = (xyz, step, stepSize, limbLength) => {
  const { t1: x, t2: y, t3: z } = xyz
  const a = (Math.sin(step * stepSize) * limbLength)
  const b = (Math.cos(step * stepSize) * limbLength)
  return new Triplet(x + a, y + b, z).rounded()
}

/**
 * Calculate the angles to move the joints to make the foot move to the next position
 * @param { Pos } thisPos - angles of joints Hip, Femur and Knee as well as limb lengths and start position
 * @param {integer} step - which step are we on at the moment
 * @returns Triplet containing the new angles
 */
const move = (thisPos, step) => {
  const steps = 36
  const stepSize = (Math.PI * 2) / steps

  // work out where the foot is now as xyz
  const xyz = calculateXyz(thisPos)
  const legPos = new Triplet(thisPos.footPosition, thisPos.groundClearance, 200)
  // work out where we want the foot to move to
  const newPos = nextPos(legPos, step, stepSize, thisPos.tibiaLength)

  const newAngles = anglesFromPosition(newPos, thisPos.femurLength) // returns a triplet
  return newAngles.rounded() // whole angles please
}

module.exports = {
  move,
  calculateXyz,
  nextPos,
  anglesFromPosition
}
