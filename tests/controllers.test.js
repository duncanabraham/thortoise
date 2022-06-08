const { expect } = require('chai')
const Controller = require('../lib/controller')
const { CommandQueue } = require('../lib/command')

const status = {
  sendStatusCalled: false,
  statusCode: 0
}

class MockRobot {
  constructor() {
    this.commandQueue = new CommandQueue()
    this.brain = {
      commandQueue: {
        addImmediateCommand: () => { status.addImmediateCommandCalled = true },
        nextCommand: () => { status.nextCommandCalled = true }
      }
    }
    this.commands = ['just a test command']
    this.saveWorld = () => { status.saveWorldCalled = true }
    this.export = 'TEST EXPORT'
    this.state = 'TEST STATE'
    this.store = {
      get: (n) => { return n }
    }
  }
}

const mocks = {
  app: {
    all: () => { },
    use: () => { }
  },
  robot: new MockRobot(),
  res: {
    sendStatus: (code) => {
      status.sendStatusCalled = true
      status.statusCode = code
    },
    send: (value) => {
      status.sendValue = JSON.stringify(value)
    }
  },
  req: {
    body: {}
  }
}

describe('the Controller class', () => {
  let controller
  beforeEach(() => {
    controller = new Controller({ app: mocks.app, robot: mocks.robot })
  })
  it('should provide a handler for the express end points', () => {
    expect(typeof controller.handler).to.equal('function')
  })
  describe('when handler() is called', () => {
    it('should call res.sendStatus to return statusCode 200', () => {
      controller.handler(mocks.req, mocks.res)
      expect(status.sendStatusCalled).to.equal(true)
      expect(status.statusCode).to.equal(200)
    })
    it('should return a "Do Nothing" command if no command is provided', () => {
      const mockQueueItem = mocks.robot.commandQueue.nextCommand()
      expect(mockQueueItem.name).to.equal('Do Nothing')
    })
    it('should return a valid command if one is provided', () => {
      const mockReq = {
        ...mocks.req,
        body: {
          name: 'Sleep',
          action: 'sleep'
        }
      }
      controller.handler(mockReq, mocks.res)
      const mockQueueItem = mocks.robot.commandQueue.nextCommand()

      expect(mockQueueItem.name).to.equal('Do Nothing')
    })
  })
  describe('when the method is GET', () => {
    let getHandlerCalled = false
    beforeEach(() => {
      controller.getHandler = () => {
        getHandlerCalled = true
      }
    })
    it('should call the getHandler', () => {
      const req = { method: 'GET' }
      controller.handler(req, mocks.res)
      expect(getHandlerCalled).to.equal(true)
    })
  })
  describe('the getHandler() method', () => {
    describe('when the path is "/api/map"', () => {
      it('should call robot.saveWorld()', () => {
        const req = { method: 'GET', params: ['/api/map'] }
        controller.handler(req, mocks.res)
        expect(status.saveWorldCalled).to.equal(true)
      })
    })
    describe('when the path is "/api/commands"', () => {
      it('should return robot.commands', () => {
        const req = { method: 'GET', params: ['/api/commands'] }
        controller.handler(req, mocks.res)
        const result = JSON.parse(status.sendValue)
        expect(result).to.deep.equal(['just a test command'])
      })
    })
    describe('when the path is "/api/dump"', () => {
      it('should return robot.export', () => {
        const req = { method: 'GET', params: ['/api/dump'] }
        controller.handler(req, mocks.res)
        const result = JSON.parse(status.sendValue)
        expect(result).to.deep.equal('TEST EXPORT')
      })
    })
    describe('when the path is "/api/state"', () => {
      it('should return robot.state', () => {
        const req = { method: 'GET', params: ['/api/state'] }
        controller.handler(req, mocks.res)
        const result = JSON.parse(status.sendValue)
        expect(result).to.deep.equal('TEST STATE')
      })
    })
    describe('when the path is "/api/errors"', () => {
      it('should return errors from the robot store', () => {
        const req = { method: 'GET', params: ['/api/errors'] }
        controller.handler(req, mocks.res)
        expect(status.sendValue).to.equal('"ERRORS"')
      })
    })
    describe('when the path is "/api/info"', () => {
      it('should return errors from the robot store', () => {
        const req = { method: 'GET', params: ['/api/info'] }
        controller.handler(req, mocks.res)
        expect(status.sendValue).to.equal('"INFO"')
      })
    })
    describe('when the path is unknown', () => {
      it('should return an error response', () => {
        const req = { method: 'GET', params: ['/unknown'] }
        controller.handler(req, mocks.res)
        expect(status.sendValue).to.equal('"do what??"')
      })
    })
  })
})
