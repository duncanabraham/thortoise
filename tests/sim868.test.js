/* global describe, it, beforeEach */
const SIM868 = require('../lib/SIM868')
const { expect } = require('chai')

describe('the SIM868 class', () => {
  let sim868
  beforeEach(() => {
    sim868 = new SIM868()
  })
  it('Should return "ok" when the status command is called', () => {
    sim868.status()
    expect(sim868.hasData).to.equal(true)
    expect(sim868.data).to.equal('OK')
  })
})
