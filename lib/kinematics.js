const { Triplet } = require('./triplet')

/**
 * Calculate coords from angles and limb lengths
 * I worked this out with pencil and paper and the help of this
 * website: https://www.calculator.net/triangle-calculator.html
 * @param {Pos} thisPos
 * @returns Triplet containing x,y and z positions in mm
 */
const calculateXyz = (thisPos) => {
  const { t1: q0, t2: a, t3: b, femurLength: l1, tibiaLength: l2, square, toRad, toDeg } = thisPos
  const { sin, acos, cos, sqrt } = Math

  const b1 = 180 - 90 - a
  const b2 = b - b1

  const c1 = l1 * sin(toRad(b1)) / sin(toRad(90))
  const h = l1 * sin(toRad(a)) / sin(toRad(90))

  const c2 = sqrt(square(h) + square(l2) - 2 * h * l1 * cos(toRad(b2)))

  const da = square(c2) + square(h) - square(l1)
  const db = 2 * c2 * h
  const d = toDeg(acos(da / db))

  const f = 180 - d
  const g = 180 - 90 - f

  const c3 = c2 * sin(toRad(f)) / sin(toRad(90))
  const h1 = c2 * sin(toRad(g)) / sin(toRad(90))

  const x = c1 + c3
  const y = x * sin(toRad(q0)) / sin(toRad(90))
  const z = h1

  return new Triplet(x, y, z).rounded() // These values are in mm
}

/**
 * Calculate angles from an x,y position
 * https://youtu.be/Q-UeYEpwXXU?t=285
 * @param {Triplet} position in x,y and z coordinates
 * @param {integer} l1
 * @returns Triplet Angles
 */
const anglesFromPosition = (position, l1) => {
  const { t1: x, t2: y, t3: z, toDeg, square } = position
  const { sqrt, acos, atan2 } = Math

  const b = toDeg(atan2(y, x))
  const l = sqrt(square(x) + square(y))
  const h = sqrt(square(l) + square(z))
  const phi = toDeg(atan2(z, l))

  const thetaA = (h / 2) / l1
  const theta = toDeg(acos(thetaA))

  const a1 = phi + theta
  const a2 = phi - theta
  return new Triplet(b, a1, a2).rounded() // Angles in degrees
}

/**
 * Calculate the next position to move to
 * @param {Triplet} xyz position
 * @param {number} tick - how many radians have we progressed around the circle
 * @returns Triplet xyz position
 */
const nextPos = (xyz, tick) => {
  const { t1: x, t2: y, t3: z } = xyz
  const a = 11 * Math.sin(tick) * z // circle around a point betweem the hip to the floor
  const b = 11 * Math.cos(tick) * z
  return new Triplet(x + a, y, z + b).rounded() // x,y and z positions in mm from the hip which is at (0,0,z)
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
  const tick = step * stepSize // tick is in radians

  // work out where the foot is now as xyz
  const xyz = calculateXyz(thisPos)
  
  // work out where we want the foot to move to
  const newXyz = nextPos(xyz, tick) // returns xyz position
  
  const newAngles = anglesFromPosition(newXyz, thisPos.femurLength) // returns a triplet
  return newAngles.rounded() // angles in degrees
}

module.exports = {
  move,
  calculateXyz,
  nextPos,
  anglesFromPosition
}
