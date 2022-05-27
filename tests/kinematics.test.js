/* global describe, it */
const { Triplet } = require('../lib/triplet')
const { Pos } = require('../lib/pos')
const { move, calculateXyz, nextPos, anglesFromPosition } = require('../lib/kinematics')
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
      const stepSize = (Math.PI * 2) / 36 // Each step is 10 degrees

      const step = 3 * stepSize + startPoint // 3rd step which is 30 degrees
      const result = nextPos(position, step, limbLength)
      const expectedPosition = new Triplet(174, 95, 75)

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
      const expectedResults = [[56, 73, 85], [56, 71, 88], [56, 68, 91], [57, 66, 94], [57, 63, 97], [58, 60, 101], [59, 58, 103], [60, 55, 106], [62, 52, 108], [63, 50, 111], [65, 47, 113], [67, 45, 116], [70, 42, 117], [72, 40, 119], [75, 38, 120], [77, 36, 121], [80, 34, 122], [83, 32, 122], [86, 31, 122], [90, 29, 122], [93, 31, 121], [96, 33, 120], [98, 35, 118], [101, 37, 117], [104, 40, 115], [106, 42, 114], [108, 45, 111], [111, 47, 109], [112, 50, 106], [114, 53, 103], [115, 55, 100], [117, 58, 98], [117, 61, 94], [118, 63, 91], [119, 66, 88], [119, 68, 85], [119, 71, 81], [119, 73, 78], [119, 75, 75], [118, 77, 71], [117, 79, 69], [117, 81, 65], [115, 82, 62], [114, 84, 59], [112, 84, 56], [111, 85, 53], [108, 84, 51], [106, 84, 48], [104, 83, 46], [101, 81, 44], [98, 79, 42], [96, 76, 41], [93, 73, 40], [90, 71, 40], [86, 75, 40], [83, 78, 40], [80, 82, 41], [77, 84, 43], [75, 86, 44], [72, 88, 46], [70, 89, 48], [67, 90, 50], [65, 89, 53], [63, 89, 56], [62, 88, 59], [60, 87, 62], [59, 86, 65], [58, 84, 68], [57, 82, 72], [57, 80, 75], [56, 78, 78], [56, 76, 82]]
      for (let step = 0; step < 72; step++) {
        const result = move(angles, step)
        const expectedPosition = new Triplet(expectedResults[step][0], expectedResults[step][1], expectedResults[step][2])

        expect(result.equals(expectedPosition)).to.equal(true)
      }
    })
  })
})
