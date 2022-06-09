/* global describe, it */
const { Triplet } = require('../lib/triplet')
const { expect } = require('chai')

describe('the Triplet class: ', () => {
  it('returns an object containing 3 numbers as t1, t2 and t3', () => {
    const testValue = new Triplet(1, 2, 3)
    expect(testValue.t1).to.equal(1)
    expect(testValue.t2).to.equal(2)
    expect(testValue.t3).to.equal(3)
  })
  describe('the equals method:', () => {
    it('should return true if two triplets contain the same values', () => {
      const testValue = new Triplet(1, 2, 3)
      const compValue = new Triplet(1, 2, 3)
      expect(testValue.equals(compValue)).to.equal(true)
    })
    it('should return false if two triplets DON`T contain the same values', () => {
      const testValue = new Triplet(1, 2, 3)
      const compValue = new Triplet(2, 2, 3)
      expect(testValue.equals(compValue)).to.equal(false)
    })
  })
  describe('the toRadians method:', () => {
    it('should return a new Triplet with radian values instead of degrees without changing the original Triplet', () => {
      const testValue = new Triplet(0, 45, 90)
      const testRad = testValue.toRadians()
      expect(testRad.t1).to.equal(0)
      expect(testRad.t2).to.equal(Math.PI * 0.25)
      expect(testRad.t3).to.equal(Math.PI * 0.5)
      expect(testValue.equals(new Triplet(0, 45, 90))).to.equal(true)
    })
  })
  describe('the toDegrees method:', () => {
    it('should return a radian valued Triplet as Degrees without changing the original Triplet', () => {
      const testValue = new Triplet(0, Math.PI * 0.25, Math.PI * 0.5)
      const testDeg = testValue.toDegrees()
      expect(testDeg.t1).to.equal(0)
      expect(testDeg.t2).to.equal(45)
      expect(testDeg.t3).to.equal(90)
      expect(testValue.equals(new Triplet(0, Math.PI * 0.25, Math.PI * 0.5))).to.equal(true)
    })
  })
  describe('the Rounded method:', () => {
    it('should return a new Triplet with rounded values', () => {
      const testValue = new Triplet(0.4, 45.1, 89.75)
      const roundedValues = testValue.rounded()
      expect(roundedValues.t1).to.equal(0)
      expect(roundedValues.t2).to.equal(45)
      expect(roundedValues.t3).to.equal(90)
    })
  })
  describe('the Inverse mehtod:', () => {
    it('should translate all the angles by 180 degrees', () => {
      const testAngles = new Triplet(90, 180, 270).inverse()
      expect(testAngles.t1).to.equal(270)
      expect(testAngles.t2).to.equal(0)
      expect(testAngles.t3).to.equal(90)
    })
  })
  describe('the value() method', () => {
    it('should return an array of the current values', () => {
      const testAngles = new Triplet(90, 180, 270)
      const result = testAngles.value()
      expect(result).to.deep.equal([90, 180, 270])
    })
  })
  describe('the export() method', () => {
    it('should return a string representation of the array value of the current values', () => {
      const testAngles = new Triplet(90, 180, 270)
      const result = testAngles.export()
      expect(result).to.deep.equal('90,180,270')
    })
  })
})
