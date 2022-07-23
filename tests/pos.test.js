/* global describe, it, beforeEach */
const { Pos } = require('../lib/pos')
const { Triplet } = require('../lib/triplet')
const { expect } = require('chai')

describe('the Pos class:', () => {
  let pos
  beforeEach(() => {
    pos = new Pos(45, 50, 75, 'test', 0, 155, 155)
  })
  it('should create an object with known attributes', () => {
    const attrs = ['x', 'y', 'z', 'name', 'startPos', 'distanceFromHipToFoot', 'angleAtFemur', 'angleAtKnee', 'angleAtHip', 'femurLength', 'tibiaLength', 'groundClearance']
    let hasAllAttributes = true
    attrs.forEach(a => {
      if (!(a in pos)) {
        hasAllAttributes = false
      }
    })
    expect(hasAllAttributes).to.equal(true)
  })
  describe('the angles setter', () => {
    it('should accept a Triplet and set the current x,y and z values', () => {
      const newPosition = new Triplet(10, 20, 30)
      pos.setAngles(newPosition)
      expect(pos.x).to.equal(10)
      expect(pos.y).to.equal(20)
      expect(pos.z).to.equal(30)
    })
  })
  describe('the calculated xyz position', () => {
    it('should work out the mm positions based on the angles and limb lengths', () => {
      const { position: { x: x, y: y, z: z } } = pos
      expect(x).to.equal(189) // don't change these values, if the test is broken
      expect(y).to.equal(133) // its because you broke the maths in POS or
      expect(z).to.equal(8) // in kinematics.js
    })
  })
  describe('the addAngles() method', () => {
    it('should accept a triplet and add the values to the current values', () => {
      const newPosition = new Triplet(10, 20, 30)
      pos.setAngles(newPosition)
      const addPosition = new Triplet(10, 20, 30)

      pos.addAngles(addPosition)
      expect(pos.export()).to.equal('20,40,60')
    })
  })
  describe('the clone() method', () => {
    it('should return a new pos object which is the same as the current pos object', () => {
      const newPos = pos.clone()
      expect(newPos).to.deep.equal(pos)
    })
  })
  describe('the getAngles() method', () => {
    it('should return the current angle values as a Triplet', () => {
      const newPosition = new Triplet(10, 20, 30)
      pos.setAngles(newPosition)
      const result = pos.getAngles()
      expect(result).to.be.an.instanceOf(Triplet)
      expect(result.x).to.equal(10)
      expect(result.y).to.equal(20)
      expect(result.z).to.equal(30)
    })
  })
})
