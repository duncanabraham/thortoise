const { expect } = require('chai')
const Controller = require('../lib/controller')
const { CommandQueue } = require('../lib/command')

class MockRobot {
  constructor() {
    this.commandQueue = new CommandQueue()
  }
}

const status = {
  sendStatusCalled: false,
  statusCode: 0
}

const mocks = {
  app: {
    all: () => { }
  },
  robot: new MockRobot(),
  res: {
    sendStatus: (code) => {
      status.sendStatusCalled = true
      status.statusCode = code
    }
  },
  req: {
    body: {}
  }
}

describe('the Controllers class', () => {
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
    it('should set the command origin to human', () => {
      controller.handler(mocks.req, mocks.res)
      const mockQueueItem = mocks.robot.commandQueue.nextCommand()
      expect(mockQueueItem.origin).to.equal('human')
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
      
      expect(mockQueueItem.name).to.equal('Sleep')
      expect(mockQueueItem.action).to.equal('sleep')
      expect(mockQueueItem.origin).to.equal('human')
    })
  })
})
