/* global describe, it, beforeEach */
const Odometry = require('../lib/odometry')
const { expect } = require('chai')

describe('the Odometry class:', () => {
  let odom
  beforeEach(() => {
    odom = new Odometry()
  })
  it('should accept values', () => {
    odom.add({ value1: 'something 1 ', value2: 'something 2' })
    odom.add({ value3: 'something 3', value1: 'something 4' })
    const expectedResult = '{"value1":"something 4","value2":"something 2","value3":"something 3"}'
    const result = odom.send()
    expect(result).to.equal(expectedResult)
  })

  it('should remove all values when clear is called', () => {
    odom.add({ value1: 'something 1 ', value2: 'something 2' })
    odom.add({ value3: 'something 3', value1: 'something 4' })
    odom.clear()
    const expectedResult = '{}'
    const result = odom.send()
    expect(result).to.equal(expectedResult)
  })
})
