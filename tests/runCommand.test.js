/* global exec */
const { expect } = require('chai')
const mock = require('mock-require')
const path = require('path')

let state = {}

const mockExecSuccess = {
  exec: (command, cb) => {
    state.command = command
    cb(null, 'test worked')
  }
}

const mockExecFailed = {
  exec: (command, cb) => {
    state.command = command
    cb('error')
  }
}

const mockExec = 'test function'

let result
const oldConsole = console

const mockConsole = {
  error: (message) => { result = `error: ${JSON.stringify(message)}` },
  info: (message) => { result = `info: ${JSON.stringify(message)}` },
  log: oldConsole.log
}

describe('the runCommand library', () => {
  before(() => {
    console = mockConsole
  })

  after(() => {
    console = oldConsole
  })

  describe('the shutdown command', () => {
    beforeEach(() => {
      result = ''
      state = {}
    })
    describe('when the command runs successfully', () => {
      let runCommand
      beforeEach(() => {
        mock('child_process', mockExecSuccess)
        delete require.cache[path.join(__dirname, '../lib/runCommand.js')]
        runCommand = require('../lib/runCommand')
      })
      afterEach(() => {
        mock.stop('child_process')
      })
      it('should return "test worked" message', () => {
        runCommand.shutdown()
        expect(result).to.equal('info: "Shutdown command sent: test worked"')
      })
    })
    describe('when the command runs UNsuccessfully', () => {
      let runCommand
      beforeEach(() => {
        mock('child_process', mockExecFailed)
        delete require.cache[path.join(__dirname, '../lib/runCommand.js')]
        runCommand = require('../lib/runCommand')
      })
      afterEach(() => {
        mock.stop('child_process')
      })
      it('should return an error', () => {
        runCommand.shutdown()
        expect(result).to.contain('error: {"timeStamp":')
      })
    })
  })
})
