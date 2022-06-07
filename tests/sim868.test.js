/* global describe, it, beforeEach */
const SIM868 = require('../lib/SIM868')
const { expect } = require('chai')
const { delay } = require('../lib/utils')

describe('the SIM868 class', () => {
  let sim868
  beforeEach(() => {
    sim868 = new SIM868()
  })
  it('Should return "ok" when the status command is called', async () => {
    sim868.status()
    await delay(500)
    expect(sim868.hasData()).to.equal(true)
    expect(sim868.getData()).to.equal('OK')
  })
})
