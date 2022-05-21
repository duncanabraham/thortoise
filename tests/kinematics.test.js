const { Triplet } = require('../lib/triplet')
const { cw, ccw, xyz, nextPos } = require('../lib/kinematics')
const { expect } = require('chai')

describe('calculating positions', () => {
  describe('toRadians', () => { // TODO: move this to a triplet test
    it('should convert degrees to radians', () => {
      const angles = new Triplet(90, 45, 180)
      const expectedAngles = new Triplet(Math.PI / 2, Math.PI / 4, Math.PI)
      const result = angles.toRadians()
      expect(result.equals(expectedAngles)).to.equal(true)
    })
  })
  describe('the xyz method:', () => {
    it('should return a known position from known angles', () => {
      const angles = new Triplet(60, 30, 140)
      const limbLength = 155
      const result = xyz(angles, limbLength, limbLength)
      const expectedPositions = new Triplet(143.43956965174016, 248.4446224526287, 50.58453246162577)

      expect(result.equals(expectedPositions)).to.equal(true)
    })
  })
  describe('the nextPos method:', () => {
    it('should work out where the foot needs to move to next', () => {
      const angles = new Triplet(60, 30, 140)
      const limbLength = 155
      const position = xyz(angles, limbLength, limbLength)
      const startPoint = 0 // start at the top
      const stepSize = (Math.PI * 2) / 36 // Each step is 10 degrees

      const step = 3 * stepSize + startPoint // 3rd step which is 30 degrees
      const result = nextPos(step, limbLength, position)

      const expectedPostion = new Triplet(182.18956965174016, 315.5615912459227, 50.58453246162577)

      expect(result.equals(expectedPostion))
    })
  })
  describe('the cw method:', () => {
    it('should convert the newly calculated position to the corresponding servo angles', () => {
      const angles = new Triplet(60, 30, 140)
      const limbLength = 155
      const startPoint = 0
      const ticks = 36
      for (let tick = 0; tick < ticks; tick++) {
        const result = cw(angles, startPoint, ticks, tick, limbLength, limbLength)
        console.log(result)
      }
    })
  })
})
