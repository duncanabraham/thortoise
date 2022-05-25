/* global describe, it */
const { Pos } = require('../lib/pos')
const { Triplet } = require('../lib/triplet')
const { expect } = require('chai')

describe('the Pos class:', () => {
  let pos
  beforeEach(() => {
    pos = new Pos(60, 30, 140, 'test', 0, 155, 155)
  })
  it('should create an object with known attributes', () => {
    const attrs = ['t1', 't2', 't3', 'name', 'startPos', 'distanceFromHipToFoot', 'angleAtFemur', 'angleAtKnee', 'angleAtHip', 'femurLength', 'tibiaLength', 'groundClearance']
    let hasAllAttributes = true
    attrs.forEach(a => {
      if (!(a in pos)) {
        hasAllAttributes = false
      }
    })
    expect(hasAllAttributes).to.equal(true)
  })
  describe('the angles setter', () => {
    it('should accept a Triplet and set the current t1,t2 and t3 values', () => {
      const newPosition = new Triplet(10, 20, 30)
      pos.setAngles(newPosition)
      expect(pos.t1).to.equal(10)
      expect(pos.t2).to.equal(20)
      expect(pos.t3).to.equal(30)
    })
  })
  describe('the calculated xyz position', () => {
    it('should work out the mm positions based on the angles and limb lengths', () => {
      // See this video for calculations and solutions
      /// https://www.youtube.com/watch?v=NRgNDlVtmz0
      const { position: { t1: x, t2: y, t3: z } } = pos
      expect(x).to.equal(143) // don't change these values, if the test is broken
      expect(y).to.equal(248) // its because you broke the maths in POS or
      expect(z).to.equal(34) // in kinematics.js
    })
  })
})
