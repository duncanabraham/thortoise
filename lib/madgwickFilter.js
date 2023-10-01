class Quaternion {
  constructor (w, x, y, z) {
    this.w = w
    this.x = x
    this.y = y
    this.z = z
  }

  normalize () {
    const norm = Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z)
    this.w /= norm
    this.x /= norm
    this.y /= norm
    this.z /= norm
  }

  multiply (rhs) {
    const w = this.w * rhs.w - this.x * rhs.x - this.y * rhs.y - this.z * rhs.z
    const x = this.w * rhs.x + this.x * rhs.w + this.y * rhs.z - this.z * rhs.y
    const y = this.w * rhs.y - this.x * rhs.z + this.y * rhs.w + this.z * rhs.x
    const z = this.w * rhs.z + this.x * rhs.y - this.y * rhs.x + this.z * rhs.w
    return new Quaternion(w, x, y, z)
  }
}

function madgwickAHRSUpdate (beta, sampleFreq, q, gx, gy, gz, ax, ay, az, mx, my, mz) {
  let recipNorm
  let s0, s1, s2, s3
  let hx, hy
  let _2bx, _2bz
  let _4bx, _4bz
  let _2q0mx, _2q0my, _2q0mz, _2q1mx

  // Auxiliary variables to avoid repeated arithmetic
  const _2ax = 2 * ax
  const _2ay = 2 * ay
  const _2az = 2 * az
  const q0q0 = q.w * q.w
  const q0q1 = q.w * q.x
  const q0q2 = q.w * q.y
  const q0q3 = q.w * q.z
  const q1q1 = q.x * q.x
  const q1q2 = q.x * q.y
  const q1q3 = q.x * q.z
  const q2q2 = q.y * q.y
  const q2q3 = q.y * q.z
  const q3q3 = q.z * q.z

  // Normalise accelerometer measurement
  recipNorm = 1 / Math.sqrt(ax * ax + ay * ay + az * az)
  ax *= recipNorm
  ay *= recipNorm
  az *= recipNorm

  // Normalise magnetometer measurement
  recipNorm = 1 / Math.sqrt(mx * mx + my * my + mz * mz)
  mx *= recipNorm
  my *= recipNorm
  mz *= recipNorm

  // Reference direction of Earth's magnetic field
  hx = 2 * mx * (0.5 - q2q2 - q3q3) + 2 * my * (q1q2 - q0q3) + 2 * mz * (q1q3 + q0q2)
  hy = 2 * mx * (q1q2 + q0q3) + 2 * my * (0.5 - q1q1 - q3q3) + 2 * mz * (q2q3 - q0q1)
  _2bx = Math.sqrt(hx * hx + hy * hy)
  _2bz = 2 * mx * (q1q3 - q0q2) + 2 * my * (q2q3 + q0q1) + 2 * mz * (0.5 - q1q1 - q2q2)
  _4bx = 2 * _2bx
  _4bz = 2 * _2bz

  // Gradient decent algorithm corrective step
  s0 = -_4bz * q2q2 - _2ax * q.w - _2bz * q.z + _4bx * q.x * q.z - _2bz * q.x + _4bz * q.y * q.w - _2ay * q.z + _4bz * q.y * q.z - _4bz * q.y * q.y + _4bz * q.w - _4bx * q.y * q.x + _2bx * q.x + _2bz * q.y - _2az * q.y + _2bx * q.z + _2ax * q.y + _2bx * q.w - _2ay * q.w
  s1 = _2bz * q.z - _4bz * q.y * q.x - _2ax * q.x + _4bz * q.y * q.w - _2ay * q.y + _4bz * q.y * q.z - _4bz * q.y * q.y + _4bz * q.w + _4bx * q.y * q.x + _2bz * q.x - _2bz * q.w - _2az * q.z + _2bx * q.x + _2bx * q.w - _4bx * q.x * q.z + _2ax * q.z - _2ay * q.x
  s2 = -_2bz * q.y + _4bz * q.y * q.w - _2ay * q.x + _4bz * q.y * q.z - _4bz * q.y * q.y + _4bz * q.w - _2bz * q.x - _2bz * q.w + _2az * q.y + _2bx * q.y + _2bx * q.z - _4bx * q.y * q.x + _2ax * q.x + _4bx * q.x * q.z - _2ay * q.z + _2bx * q.z
  s3 = _4bz * q.y * q.x - _2ax * q.z + _4bz * q.y * q.w - _2ay * q.w - _4bz * q.y * q.z + _4bz * q.y * q.y - _4bz * q.w - _2bz * q.x + _2bz * q.y + _2bz * q.z - _2az * q.x + _2bz * q.z - _2ay * q.y + _2bx * q.x - _4bx * q.x * q.z + _2ax * q.w + _2bx * q.w
  recipNorm = 1 / Math.sqrt(s0 * s0 + s1 * s1 + s2 * s2 + s3 * s3)
  s0 *= recipNorm
  s1 *= recipNorm
  s2 *= recipNorm
  s3 *= recipNorm

  // Apply feedback step
  const deltat = 1 / sampleFreq
  const qw = q.w + (-q.x * gx - q.y * gy - q.z * gz) * (0.5 * deltat)
  const qx = q.x + (q.w * gx + q.y * gz - q.z * gy) * (0.5 * deltat)
  const qy = q.y + (q.w * gy - q.x * gz + q.z * gx) * (0.5 * deltat)
  const qz = q.z + (q.w * gz + q.x * gy - q.y * gx) * (0.5 * deltat)

  q.w = qw - beta * s0 * deltat
  q.x = qx - beta * s1 * deltat
  q.y = qy - beta * s2 * deltat
  q.z = qz - beta * s3 * deltat

  // Re-normalise quaternion
  q.normalize()
}

module.exports = (gyroX, gyroY, gyroZ, accelX, accelY, accelZ, magX, magY, magZ) => {
  // Initialize quaternion for the algorithm
  const q = new Quaternion(1, 0, 0, 0)

  // Madgwick filter hyperparameters
  const beta = 0.1
  const sampleFreq = 100.0 // Sample frequency in Hz

  // Run Madgwick filter algorithm
  madgwickAHRSUpdate(beta, sampleFreq, q, gyroX, gyroY, gyroZ, accelX, accelY, accelZ, magX, magY, magZ)

  // Compute Euler angles
  const roll = Math.atan2(2 * (q.w * q.x + q.y * q.z), 1 - 2 * (q.x * q.x + q.y * q.y))
  const pitch = Math.asin(2 * (q.w * q.y - q.z * q.x))
  const yaw = Math.atan2(2 * (q.w * q.z + q.x * q.y), 1 - 2 * (q.y * q.y + q.z * q.z))

  // Return Euler angles
  return {
    roll: roll * (180 / Math.PI),
    pitch: pitch * (180 / Math.PI),
    yaw: yaw * (180 / Math.PI)
  }
}
