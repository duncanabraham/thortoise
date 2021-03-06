const { Triplet } = require('./triplet')

/**
 * Calculate coords from angles and limb lengths
 * I worked this out with pencil and paper and the help of this
 * website: https://www.calculator.net/triangle-calculator.html
 * @param {Pos} thisPos
 * @returns Triplet containing x,y and z positions in mm
 */
const calculateXyz = (thisPos) => {
  const { x: q0, y: a, z: b, femurLength: l1, tibiaLength: l2, square, toRad, toDeg } = thisPos
  const { sin, acos, cos, sqrt } = Math

  const sinRad90 = sin(toRad(90))

  const b1 = 180 - 90 - a // angle in degrees
  const b2 = b - b1 // angle in degrees

  const c1 = l1 * sin(toRad(b1)) / sinRad90 // length in mm
  const h = l1 * sin(toRad(a)) / sinRad90 // length in mm

  const c2 = sqrt(square(h) + square(l2) - 2 * h * l1 * cos(toRad(b2))) // length in mm

  const da = square(c2) + square(h) - square(l1)
  const db = 2 * c2 * h
  const d = toDeg(acos(da / db)) // angle in degrees

  const f = 180 - d
  const g = 180 - 90 - f

  const c3 = c2 * sin(toRad(f)) / sinRad90 // length in mm
  const h1 = c2 * sin(toRad(g)) / sinRad90 // length in mm

  const x = c1 + c3
  const y = x * sin(toRad(q0)) / sinRad90 // length in mm
  const z = h1
  return new Triplet(x, y, z).rounded() // These values are in mm
}

/**
 * Calculate the knee and femur angles from the x and z coords
 * sI worked this out with pencil and paper and the help of this
 * website: https://www.calculator.net/triangle-calculator.html
 * @param {Triplet} position
 * @param {integer} l1
 * @param {integer} l2
 */
const anglesFromPosition = (position, l1, l2) => {
  const { x: z, y: y, z: x, toDeg, square } = position
  const { sqrt, acos } = Math

  const h1 = sqrt(square(x) + square(y))
  const ca = square(x) + square(h1) - square(y)
  const cb = 2 * x * h1
  const c = acos(ca / cb)

  const h = sqrt(square(x) + square(z))
  const ba = square(l1) + square(l2) - square(h)
  const bb = 2 * l1 * l2
  const b = acos(ba / bb)

  const a1a = square(l1) + square(h) - square(l2)
  const a1b = 2 * l1 * h
  const a1 = acos(a1a / a1b)

  const a2a = square(h) + square(z) - square(x)
  const a2b = 2 * h * z
  const a2 = acos(a2a / a2b)
  return new Triplet(toDeg(c), toDeg(a1 + a2), toDeg(b))
}

/**
 * Calculate the next position to move to
 * @param {Triplet} xyz position
 * @param {number} tick - how many radians have we progressed around the circle
 * @returns Triplet xyz position
 */
const nextPos = (xyz, tick) => {
  const { x: x, y: y, z: z } = xyz
  const radius = 65
  const a = Math.sin(tick) * (radius * 1.4) // circle around a point betweem the hip to the floor
  const b = Math.cos(tick) * radius
  return new Triplet(x + a, y, z + b).rounded() // x,y and z positions in mm from the hip which is at (0,0,z)
}

/**
 * What goes around, comes around...
 * @param {number} tick where are we?
 * @returns {number} tick constrained by our limits
 */
const fixTick = (tick) => {
  const rads = Math.PI * 2
  if (tick > rads) {
    tick = tick - rads
  }
  if (tick < 0) {
    tick = tick + rads
  }
  return tick
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
  const tick = fixTick((step * stepSize) + thisPos.startPos) // tick is in radians

  // work out where the foot is now as xyz
  const xyz = calculateXyz(thisPos)

  // work out where we want the foot to move to
  const newXyz = nextPos(xyz, tick) // returns xyz position

  // work out the servo angles from the new xyz position
  const newAngles = anglesFromPosition(newXyz, thisPos.femurLength, thisPos.tibiaLength).rounded() // returns a triplet
  return newAngles // angles in degrees
}

module.exports = {
  move,
  calculateXyz,
  nextPos,
  anglesFromPosition,
  fixTick
}
