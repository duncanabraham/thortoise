const { Triplet } = require('../lib/triplet')
const { Pos } = require('../lib/pos')
const { move, calculateXyz, nextPos } = require('../lib/kinematics')
const { expect } = require('chai')

describe('the Kinematics class:', () => {
  describe('the calculateXyz method:', () => {
    it('should return a known position from known angles', () => {
      const limbLength = 155
      const position = new Pos(60, 30, 140, 'test leg', 0, limbLength, limbLength)
      const result = calculateXyz(position)
      const expectedPositions = new Triplet(143.43956965174016, 248.4446224526287, 50.58453246162577)
      expect(result.equals(expectedPositions)).to.equal(true)
    })
  })
  describe('the nextPos method:', () => {
    it('should work out where the foot needs to move to next', () => {
      const limbLength = 155
      const angles = new Pos(60, 30, 140, 'test leg', 0, limbLength, limbLength)
      const position = calculateXyz(angles)
      const startPoint = 0 // start at the top
      const stepSize = (Math.PI * 2) / 36 // Each step is 10 degrees

      const step = 3 * stepSize + startPoint // 3rd step which is 30 degrees
      const result = nextPos(position, step, limbLength)

      const expectedPostion = new Triplet(182.18956965174016, 315.5615912459227, 50.58453246162577)

      expect(result.equals(expectedPostion))
    })
  })
  describe('the move method:', () => {
    it('should convert the newly calculated position to the corresponding servo angles', () => {
      const limbLength = 155
      const angles = new Pos(60, 30, 140, 'test leg', 0, limbLength, limbLength)
      const startPoint = Math.PI / 4
      const ticks = 72
      const tick = 36
      const result = move(angles, ticks, tick)
      expect(result.t2).to.equal(4)
      expect(result.t3).to.equal(92)
    })
  })
})
