/* global describe, it */
const { Triplet } = require('../lib/triplet')
const { expect } = require('chai')

describe('the Triplet class: ', () => {
  it('returns an object containing 3 numbers as x, y and z', () => {
    const testValue = new Triplet(1, 2, 3)
    expect(testValue.x).to.equal(1)
    expect(testValue.y).to.equal(2)
    expect(testValue.z).to.equal(3)
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
      expect(testRad.x).to.equal(0)
      expect(testRad.y).to.equal(Math.PI * 0.25)
      expect(testRad.z).to.equal(Math.PI * 0.5)
      expect(testValue.equals(new Triplet(0, 45, 90))).to.equal(true)
    })
  })
  describe('the toDegrees method:', () => {
    it('should return a radian valued Triplet as Degrees without changing the original Triplet', () => {
      const testValue = new Triplet(0, Math.PI * 0.25, Math.PI * 0.5)
      const testDeg = testValue.toDegrees()
      expect(testDeg.x).to.equal(0)
      expect(testDeg.y).to.equal(45)
      expect(testDeg.z).to.equal(90)
      expect(testValue.equals(new Triplet(0, Math.PI * 0.25, Math.PI * 0.5))).to.equal(true)
    })
  })
  describe('the Rounded method:', () => {
    it('should return a new Triplet with rounded values', () => {
      const testValue = new Triplet(0.4, 45.1, 89.75)
      const roundedValues = testValue.rounded()
      expect(roundedValues.x).to.equal(0)
      expect(roundedValues.y).to.equal(45)
      expect(roundedValues.z).to.equal(90)
    })
  })
  describe('the Inverse mehtod:', () => {
    it('should translate all the angles by 180 degrees', () => {
      const testAngles = new Triplet(90, 180, 270).inverse()
      expect(testAngles.x).to.equal(270)
      expect(testAngles.y).to.equal(0)
      expect(testAngles.z).to.equal(90)
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
  describe('the import() method', () => {
    it('should take 3 numbers and set the values of the current triplet', () => {
      const testAngles = new Triplet(90, 180, 270)
      testAngles.import(10, 20, 30)
      const result = testAngles.value()
      expect(result).to.deep.equal([10, 20, 30])
    })
  })
  describe('the minValues() mehod', () => {
    it('should set the current values to the new values if they are lower than the existing values', () => {
      const numbers = new Triplet(44, 55, 66)
      const testValues = new Triplet(45, 50, 61)
      numbers.minValues(testValues)
      expect(numbers.x).to.equal(44)
      expect(numbers.y).to.equal(50)
      expect(numbers.z).to.equal(61)
    })
  })
  describe('the maxValues() mehod', () => {
    it('should set the current values to the new values if they are higher than the existing values', () => {
      const numbers = new Triplet(44, 55, 66)
      const testValues = new Triplet(45, 50, 61)
      numbers.maxValues(testValues)
      expect(numbers.x).to.equal(45)
      expect(numbers.y).to.equal(55)
      expect(numbers.z).to.equal(66)
    })
  })
})
