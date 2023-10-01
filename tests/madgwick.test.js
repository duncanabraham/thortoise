/* global describe, it */
const madgwickFilter = require('../lib/madgwickFilter')
const { expect } = require('chai')

const data = { Accel0: 1000, Accel1: -797, Accel2: 14819, Gyro0: 1, Gyro1: 3, Gyro2: 0, Mag0: -37.25, Mag1: 489.25, Mag2: -542.875 }

describe('The Madgwick the calculations', () => {
  it('should take the input data and return the expected result', () => {
    const result = madgwickFilter(data.Gyro0, data.Gyro1, data.Gyro2, data.Accel0, data.Accel1, data.Accel2, data.Mag0, data.Mag1, data.Mag2)
    const expected = { roll: -3.07, pitch: 3.83, yaw: -86.5 }

    expect(result.roll).to.be.closeTo(expected.roll, 0.1)
    expect(result.pitch).to.be.closeTo(expected.pitch, 0.1)
    expect(result.heading).to.be.closeTo(expected.yaw, 0.1)
  })
})
