const { Triplet } = require('./triplet')

/**
 * https://youtu.be/EzNAs2w1cS0?t=186
 * @param {Pos} thisPos 
 * @returns Triplet containing x, y and z positions 
 */
const calculateXyz = (thisPos) => {
  const { t1: q0, t2: q1, t3: q2, femurLength: l1, tibiaLength: l2, square } = thisPos
  
  const x0 = l1 * Math.cos(q1)
  const x1 = l2 * Math.cos(q1 + q2)
  const x = x0 + x1

  const z0 = l1 * Math.sin(q1)
  const z1 = l2 * Math.sin(q1 + q2)
  const z = z0 + z1
  
  const l = Math.sqrt(square(x) + square(z))
  const y = l * Math.sin(q0)
  return new Triplet(x, y, z).rounded()
}

/**
 * Calculate angles from an x,y position
 * https://youtu.be/Q-UeYEpwXXU?t=285
 * @param {Pos} position
 * @param {integer} l1
 * @param {integer} l2
 * @returns Triplet Angles
 */
const anglesFromPosition = (position) => {
  const { t1: x, t2: y, t3: z, toDeg, square, femurLength } = position
  const b = toDeg(Math.atan2(y, x)) // hip angle in degrees
  const l = Math.sqrt(square(x) + square(y))
  const h = Math.sqrt(square(l) + square(z))
  const phi = toDeg(Math.atan(z / l))
  const theta = toDeg(Math.acos((h / 2) / femurLength))
  const a1 = phi + theta // femur angle
  const a2 = phi - theta // knee angle
  return new Triplet(b, a1, a2)
}

/**
 * Calculate the next position to move to
 * @param {Triplet} xyz position
 * @param {number} tick - how many radians have we progressed around the circle
 * @returns Triplet xyz position
 */
const nextPos = (xyz, tick) => {
  const { t1: x, t2: y, t3: z } = xyz
  const a = Math.sin(tick) * (z * 0.75) // circle around a point betweem the hip to the floor
  const b = Math.cos(tick) * (z * 0.75)
  return new Triplet(x + a, y, z + b)
}

/**
 * Calculate the angles to move the joints to make the foot move to the next position
 * @param { Pos } thisPos - angles of joints Hip, Femur and Knee as well as limb lengths and start position
 * @param {integer} step - which step are we on at the moment
 * @returns Triplet containing the new angles
 */
const move = (thisPos, step) => {
  const steps = 72
  const stepSize = (Math.PI * 2) / steps
  const tick = step * stepSize

  // work out where the foot is now as xyz
  const xyz = calculateXyz(thisPos)

  // work out where we want the foot to move to
  const newXyz = nextPos(xyz, tick)
  const xyzPos = thisPos.clone()
  xyzPos.setAngles(newXyz)
  const newAngles = anglesFromPosition(xyzPos) // returns a triplet
  // newAngles.fixNegativeAngles()

  return newAngles.rounded() // whole angles please
}

module.exports = {
  move,
  calculateXyz,
  nextPos,
  anglesFromPosition
}

