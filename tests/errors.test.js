const { expect } = require('chai')
const errors = require('../lib/errors')

describe('the Errors class', () => {
  it('returns a REDIS_CLIENT_GENERAL_ERROR error', () => {
    const result = errors.REDIS_CLIENT_GENERAL_ERROR('testModule','test message')

    expect(result.moduleName).to.equal('testModule')
    expect(result.message).to.equal('test message')
    expect(result.errorName).to.equal('REDIS_CLIENT_GENERAL_ERROR')
    expect('timeStamp' in result).to.equal(true)
  })

  it('returns a REDIS_CLIENT_READ_ERROR error', () => {
    const result = errors.REDIS_CLIENT_READ_ERROR('testModule','test message')

    expect(result.moduleName).to.equal('testModule')
    expect(result.message).to.equal('test message')
    expect(result.errorName).to.equal('REDIS_CLIENT_READ_ERROR')
    expect('timeStamp' in result).to.equal(true)
  })

  it('returns a REDIS_CLIENT_CONNECT_ERROR error', () => {
    const result = errors.REDIS_CLIENT_CONNECT_ERROR('testModule','test message')

    expect(result.moduleName).to.equal('testModule')
    expect(result.message).to.equal('test message')
    expect(result.errorName).to.equal('REDIS_CLIENT_CONNECT_ERROR')
    expect('timeStamp' in result).to.equal(true)
  })

  it('returns a REDIS_CLIENT_SET_DATA_ERROR error', () => {
    const result = errors.REDIS_CLIENT_SET_DATA_ERROR('testModule','test message')

    expect(result.moduleName).to.equal('testModule')
    expect(result.message).to.equal('test message')
    expect(result.errorName).to.equal('REDIS_CLIENT_SET_DATA_ERROR')
    expect('timeStamp' in result).to.equal(true)
  })

  it('returns a REDIS_CLIENT_GETDEL_DATA_ERROR error', () => {
    const result = errors.REDIS_CLIENT_GETDEL_DATA_ERROR('testModule','test message')

    expect(result.moduleName).to.equal('testModule')
    expect(result.message).to.equal('test message')
    expect(result.errorName).to.equal('REDIS_CLIENT_GETDEL_DATA_ERROR')
    expect('timeStamp' in result).to.equal(true)
  })

  it('returns a SHUTDOWN_ERROR error', () => {
    const result = errors.SHUTDOWN_ERROR('testModule','test message')

    expect(result.moduleName).to.equal('testModule')
    expect(result.message).to.equal('test message')
    expect(result.errorName).to.equal('SHUTDOWN_ERROR')
    expect('timeStamp' in result).to.equal(true)
  })
})
