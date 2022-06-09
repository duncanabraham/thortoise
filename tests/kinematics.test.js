/* global describe, it */
const { Triplet } = require('../lib/triplet')
const { Pos } = require('../lib/pos')
const { move, calculateXyz, nextPos, anglesFromPosition, fixTick } = require('../lib/kinematics')
const { expect } = require('chai')

describe('the Kinematics class:', () => {
  describe('the calculateXyz method:', () => {
    it('should return a known position from known angles', () => {
      const limbLength = 110
      const position = new Pos(45, 50, 75, 'test leg', 0, limbLength, limbLength)
      const result = calculateXyz(position)
      const expectedPosition = new Triplet(134, 95, 6)

      expect(result.equals(expectedPosition)).to.equal(true)
    })
  })
  describe('the nextPos method:', () => {
    it('should work out where the foot needs to move to next', () => {
      const limbLength = 110
      const angles = new Pos(45, 50, 75, 'test leg', 0, limbLength, limbLength)
      const position = calculateXyz(angles)
      const startPoint = 0 // start at the top
      const stepSize = (Math.PI * 2) / 72 // Each step is 5 degrees

      const step = 3 * stepSize + startPoint // 3rd step which is 30 degrees
      const result = nextPos(position, step, limbLength)
      const expectedPosition = new Triplet(158, 95, 69)

      expect(result.equals(expectedPosition)).to.equal(true)
    })
  })
  describe('the anglesFromPosition method:', () => {
    it('should calculate the servo angles for the 3 leg servos', () => {
      // const testData = new Triplet(70,104,152)
      const testData = new Triplet(152, 104, 70)
      const limb1 = 110
      const limb2 = 110
      const newAngles = anglesFromPosition(testData, limb1, limb2).rounded()

      expect(newAngles.t1).to.equal(56)
      expect(newAngles.t2).to.equal(65)
      expect(newAngles.t3).to.equal(99)
    })
  })
  describe('the move method:', () => {
    it('should convert the newly calculated position to the corresponding servo angles', () => {
      const limbLength = 150
      const startPoint = 0
      const angles = new Pos(45, 50, 75, 'test leg', startPoint, limbLength, limbLength)
      const expectedResults = [[60, 71, 82], [60, 68, 85], [61, 65, 89], [61, 62, 93], [62, 60, 97], [63, 57, 100], [64, 54, 104], [65, 51, 107], [66, 48, 111], [67, 45, 114], [69, 42, 118], [71, 40, 121], [72, 37, 123], [75, 35, 125], [77, 32, 128], [79, 31, 129], [82, 29, 131], [84, 27, 131], [86, 26, 131], [89, 25, 131], [91, 26, 130], [94, 28, 128], [96, 30, 127], [98, 32, 124], [101, 34, 122], [103, 37, 119], [105, 40, 116], [106, 43, 112], [108, 46, 109], [109, 48, 105], [110, 51, 102], [112, 54, 98], [112, 57, 94], [113, 60, 91], [113, 62, 87], [114, 65, 83], [114, 68, 79], [114, 71, 75], [113, 73, 71], [113, 75, 68], [112, 77, 64], [112, 79, 61], [110, 80, 58], [109, 82, 55], [108, 83, 52], [106, 83, 49], [105, 84, 46], [103, 83, 43], [101, 83, 41], [98, 81, 40], [96, 79, 38], [94, 77, 37], [91, 74, 36], [89, 74, 35], [86, 77, 35], [84, 81, 36], [82, 83, 36], [79, 86, 38], [77, 88, 39], [75, 89, 41], [72, 90, 43], [71, 90, 46], [69, 90, 48], [67, 89, 51], [66, 88, 54], [65, 87, 57], [64, 85, 60], [63, 83, 64], [62, 81, 67], [61, 79, 71], [61, 76, 74], [60, 74, 78]]
      for (let step = 0; step < 72; step++) {
        const result = move(angles, step)
        const expectedPosition = new Triplet(expectedResults[step][0], expectedResults[step][1], expectedResults[step][2])

        expect(result.equals(expectedPosition)).to.equal(true)
      }
    })
  })
  describe('the fixTick() method:', () => {
    it('should ensure an increasing tick stays within the circle', () => {
      const result = fixTick(7)
      expect(result).to.equal(7 - (2 * Math.PI))
    })
    it('should ensure a decreasing tick stays within the circle', () => {
      const result = fixTick(-2)
      expect(result).to.equal(-2 + (2 * Math.PI))
    })
  })
})
