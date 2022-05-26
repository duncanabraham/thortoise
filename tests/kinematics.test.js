/* global describe, it */
const { Triplet } = require('../lib/triplet')
const { Pos } = require('../lib/pos')
const { move, calculateXyz, nextPos } = require('../lib/kinematics')
const { expect } = require('chai')

describe('the Kinematics class:', () => {
  describe('the calculateXyz method:', () => {
    it('should return a known position from known angles', () => {
      const limbLength = 110
      const position = new Pos(45, 50, 75, 'test leg', 0, limbLength, limbLength)
      const result = calculateXyz(position)
      const expectedPosition = new Triplet(6, 4, 134)
      expect(result.equals(expectedPosition)).to.equal(true)
    })
  })
  describe('the nextPos method:', () => {
    it('should work out where the foot needs to move to next', () => {
      const limbLength = 110
      const angles = new Pos(45, 50, 75, 'test leg', 0, limbLength, limbLength)
      const position = calculateXyz(angles)
      const startPoint = 0 // start at the top
      const stepSize = (Math.PI * 2) / 36 // Each step is 10 degrees

      const step = 3 * stepSize + startPoint // 3rd step which is 30 degrees
      const result = nextPos(position, step, limbLength)
      const expectedPosition = new Triplet(73, 4, 250)

      expect(result.equals(expectedPosition)).to.equal(true)
    })
  })
  describe('the move method:', () => {
    it('should convert the newly calculated position to the corresponding servo angles', () => {
      const limbLength = 155
      const startPoint = 0
      const angles = new Pos(45, 50, 75, 'test leg', startPoint, limbLength, limbLength)
      const expectedResults = [[35, 59, -14], [34, 56, -12], [33, 54, -11], [32, 51, -10], [31, 48, -9], [30, 45, -8], [30, 42, -8], [29, 39, -7], [28, 36, -6], [28, 33, -5], [27, 30, -5], [27, 27, -4], [27, 24, -4], [26, 20, -3], [26, 17, -3], [26, 15, -3], [26, 12, -3], [26, 10, -4], [26, 9, -6], [26, 8, -8], [26, 7, -10], [26, 8, -13], [26, 8, -16], [26, 8, -19], [27, 9, -22], [27, 9, -25], [27, 10, -29], [28, 10, -32], [28, 11, -35], [29, 12, -38], [30, 13, -41], [30, 13, -44], [31, 14, -47], [32, 15, -49], [33, 16, -52], [34, 17, -55], [35, 19, -57], [36, 20, -59], [37, 21, -61], [39, 23, -63], [40, 25, -65], [41, 27, -66], [43, 29, -67], [44, 31, -68], [45, 33, -68], [46, 35, -68], [47, 38, -68], [49, 41, -67], [50, 43, -67], [51, 46, -65], [51, 49, -64], [52, 52, -62], [53, 55, -60], [53, 57, -57], [53, 60, -55], [53, 63, -52], [53, 65, -49], [52, 67, -46], [51, 68, -43], [51, 70, -40], [50, 71, -37], [49, 71, -35], [47, 72, -32], [46, 71, -30], [45, 71, -28], [44, 70, -25], [43, 69, -23], [41, 68, -21], [40, 67, -19], [39, 65, -18], [37, 63, -16], [36, 61, -15]]
      for (let step = 0; step < 72; step++) {
        const result = move(angles, step)
        console.log('result: ', result)
        const expectedPosition = new Triplet(expectedResults[step][0], expectedResults[step][1], expectedResults[step][2])

        // expect(result.equals(expectedPosition)).to.equal(true)
      }
    })
  })
})
