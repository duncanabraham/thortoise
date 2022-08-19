/* global describe, it, before, after, beforeEach */
require('./common')
const { expect } = require('chai')

const Brain = require('../lib/brain')
const path = require('path')
const mock = require('mock-require')
const enums = require('../lib/enums')
const { Command } = require('../lib/command')
const Registry = require('../lib/registry')

global.registry = new Registry()

const state = {}

const mockExecSuccess = {
  exec: (command, cb) => {
    state.command = command
    cb(null, 'test worked')
  }
}

const commandOptions = {
  name: 'turn',
  action: 'turn',
  origin: 'machine',
  type: 'action',
  notes: 'north'
}

mock('child_process', mockExecSuccess)
delete require.cache[path.join(__dirname, '../lib/runCommand.js')]
const Thortoise = require('../lib/thortoise')
const { coords } = require('../lib/grid')

const cameraSettings = {
  mode: 'photo',
  output: `(${path.join(__dirname, 'image.jpg')}`,
  width: 640,
  height: 480,
  nopreview: true
}

let mockStore = {}

const wheelSettings = {
  frontLeft: { speedChannel: 0, fPin: 11, bPin: 13 },
  frontRight: { speedChannel: 1, fPin: 15, bPin: 19 },
  backLeft: { speedChannel: 2, fPin: 16, bPin: 18 },
  backRight: { speedChannel: 3, fPin: 22, bPin: 24 }
}

const mockOptions = {
  name: 'testbot',
  version: 1,
  cameraSettings,
  store: {
    append: (key, value) => { mockStore[key] = value }
  },
  wheelSettings
}

describe('The Thortoise class: ', () => {
  let thortoise
  const oldConsole = console
  let setIntervalStore
  let result = {}
  let expectedCommand
  before(() => {
    setIntervalStore = setInterval
    // eslint-disable-next-line no-global-assign
    console = {
      log: () => { },
      info: () => { },
      error: () => { }
    }
    // eslint-disable-next-line no-global-assign
    setInterval = (action, timer) => {
      result.action = action
      result.timer = timer
      return true
    }
  })
  after(() => {
    // eslint-disable-next-line no-global-assign
    console = oldConsole
    // eslint-disable-next-line no-global-assign
    setInterval = setIntervalStore
  })
  beforeEach(() => {
    result = {}
    thortoise = new Thortoise(mockOptions)
    mockStore = {}
    expectedCommand = new Command({
      name: 'turn',
      action: 'turn',
      origin: 'machine',
      type: 'action',
      notes: 'north'
    })
  })
  describe('on instantiation', () => {
    it('should add an instance of Brain', () => {
      const { brain } = thortoise
      expect(brain).to.be.an.instanceOf(Brain)
    })
    it('should set the timer value to 20', () => {
      expect(thortoise.loopSpeedMS).to.equal(20)
    })
  })
  describe('when sleep() is called', () => {
    describe('when the state is not sleeping', () => {
      it('should update the INFO store with "Starting sleep loop..."', () => {
        thortoise.sleeping = undefined
        thortoise.sleep()
        expect(mockStore.INFO).to.equal('Going to sleep')
      })
      it('should setup the sleeping loop', () => {
        thortoise.sleeping = undefined
        thortoise.sleep()
        expect('sleeping' in thortoise).to.equal(true)
      })
    })
  })
  describe('when start() is called', () => {
    describe('when the bot is sleeping', () => {
      it('should come out of sleep mode', async () => {
        thortoise.sleeping = 'sleeping'
        await thortoise.start()
        expect('sleeping' in thortoise).to.equal(false)
      })
    })
    describe('when the bot is NOT sleeping', () => {
      it('should start the running loop', async () => {
        delete thortoise.running
        await thortoise.start()
        expect(thortoise.running).to.equal(true)
      })
      it('should set up the handler on an interval timer', async () => {
        await thortoise.start()
        const thortoiseLoopSpeedMS = 20
        expect(result.action).to.be.a('function')
        expect(result.action.name).to.equal('bound _runLoop')
        expect(result.timer).to.equal(thortoiseLoopSpeedMS)
      })
    })
  })
  describe('when stop() is called', () => {
    describe('when the loop is running', () => {
      it('should clear the running interval', () => {
        thortoise.running = 'running'
        const oldCI = clearInterval
        let clearIntervalCalled = ''
        // eslint-disable-next-line no-global-assign
        clearInterval = (intervalName) => { clearIntervalCalled = intervalName }
        thortoise.stop()
        // eslint-disable-next-line no-global-assign
        clearInterval = oldCI
        expect(clearIntervalCalled).to.equal('running')
        expect('running' in thortoise).to.equal(false)
      })
    })
  })
  describe('when kill() is called', () => {
    it('should call sleep()', async () => {
      let sleepCalled = false
      thortoise.sleep = () => { sleepCalled = true }
      await thortoise.kill()
      expect(sleepCalled).to.equal(true)
    })
    it('should clear the heartbeat interval', async () => {
      expect('heartbeat' in thortoise).to.equal(true)
      await thortoise.kill()
      expect('heartbeat' in thortoise).to.equal(false)
    })
    it('it should call shutdown', async () => {
      await thortoise.kill()
      expect(state.command).to.equal('shutdown -h now')
    })
  })
  describe('when the state() getter is called', () => {
    it('should return the current state', () => {
      const result = thortoise.state
      expect(result).to.equal('idle')
    })
  })
  describe('when the export() getter is called', () => {
    it('should return a cut down thortoise object', () => {
      const result = JSON.stringify(thortoise.export)
      const expectedResult = '"name":"testbot","version":1'
      expect(result).to.contain(expectedResult)
    })
  })
  describe('when walk() is called', () => {
    it('should start the run loop', async () => {
      thortoise.running = undefined
      let startCalled = false
      thortoise.start = () => { startCalled = true }
      await thortoise.walk()
      expect(startCalled).to.equal(true)
    })
  })
  describe('when saveWorld() is called', () => {
    it('should call the brain saveWorld() mehtod', () => {
      let saveWorldCalled = false
      thortoise.brain.saveWorld = () => {
        saveWorldCalled = true
      }
      thortoise.saveWorld()
      expect(saveWorldCalled).to.equal(true)
    })
  })

  describe('when _verbose() is called and the verbose flag is set', () => {
    it('should update the store DATA log with the current kinematics', () => {
      thortoise.verbose = true
      thortoise._doMovement()
      thortoise._verbose()
      const expectedData = '{"front-left":{"x":159,"y":125,"z":62},"front-right":{"x":165,"y":87,"z":118},"back-left":{"x":168,"y":104,"z":132},"back-right":{"x":165,"y":148,"z":85}}'
      expect(mockStore.DATA).to.equal(expectedData)
    })
  })
  describe('when _checkActions() is called', () => {
    let command
    beforeEach(() => {
      const commandOptions = {
        name: 'test',
        action: 'test',
        origin: 'human',
        type: 'action',
        notes: 'test action'
      }
      command = new Command(commandOptions)
    })
    describe('and there is a human command in the queue', () => {
      it('should get the next human command from the queue and update the INFO log with the command details', () => {
        thortoise.brain.commandQueue.addCommand(command)
        expect(thortoise.brain.commandQueue.queue.length).to.equal(1)
        thortoise._checkActions()
        expect(thortoise.brain.commandQueue.queue.length).to.equal(0)
        expect(mockStore.INFO).to.equal('action test test action')
      })
    })
    describe('and there are no human commands in the queue', () => {
      beforeEach(() => {
        const commandOptions = {
          name: 'test',
          action: 'test',
          origin: 'machine',
          type: 'action',
          notes: 'test action'
        }
        command = new Command(commandOptions)
      })
      it('should get the next machine command from the queue', () => {
        thortoise.brain.commandQueue.addCommand(command)
        expect(thortoise.brain.commandQueue.queue.length).to.equal(1)
        thortoise._checkActions()
        expect(thortoise.brain.commandQueue.queue.length).to.equal(0)
        expect(mockStore.INFO).to.equal('action test test action')
      })
    })
    describe('and there are no commands in the queue', () => {
      beforeEach(() => {
        thortoise.brain.commandQueue.clearCommands()
      })
      describe('and the thortoise is not sleeping', () => {
        beforeEach(() => {
          delete thortoise.sleeping
        })
        it('should call the stand() method', () => {
          let standCalled = false
          thortoise.stand = () => { standCalled = true }
          thortoise._checkActions()
          expect(standCalled).to.equal(true)
        })
      })
      describe('and the thortoise is sleeping', () => {
        beforeEach(() => {
          thortoise.sleeping = true
        })
        it('should not call the stand() method', () => {
          let standCalled = false
          thortoise.stand = () => { standCalled = true }
          thortoise._checkActions()
          expect(standCalled).to.equal(false)
        })
      })
    })
    describe('when the action type is "action"', () => {
      describe('when the action is "north"', () => {
        it('should call the "north" method and add to the INFO queue', () => {
          command.action = 'north'
          thortoise.brain.commandQueue.addCommand(command)
          const checkStatus = {}
          thortoise.north = (action) => {
            checkStatus.action = action
            checkStatus.called = true
          }
          thortoise._checkActions()
          expect(mockStore.INFO).to.equal('action north test action')
          expect(checkStatus.called).to.equal(true)
          expect(checkStatus.action.action).to.equal('north')
        })
      })
      describe('when the action is "east"', () => {
        it('should call the "east" method and add to the INFO queue', () => {
          command.action = 'east'
          thortoise.brain.commandQueue.addCommand(command)
          const checkStatus = {}
          thortoise.east = (action) => {
            checkStatus.action = action
            checkStatus.called = true
          }
          thortoise._checkActions()
          expect(mockStore.INFO).to.equal('action east test action')
          expect(checkStatus.called).to.equal(true)
          expect(checkStatus.action.action).to.equal('east')
        })
      })
      describe('when the action is "south"', () => {
        it('should call the "south" method and add to the INFO queue', () => {
          command.action = 'south'
          thortoise.brain.commandQueue.addCommand(command)
          const checkStatus = {}
          thortoise.south = (action) => {
            checkStatus.action = action
            checkStatus.called = true
          }
          thortoise._checkActions()
          expect(mockStore.INFO).to.equal('action south test action')
          expect(checkStatus.called).to.equal(true)
          expect(checkStatus.action.action).to.equal('south')
        })
      })
      describe('when the action is "west"', () => {
        it('should call the "west" method and add to the INFO queue', () => {
          command.action = 'west'
          thortoise.brain.commandQueue.addCommand(command)
          const checkStatus = {}
          thortoise.west = (action) => {
            checkStatus.action = action
            checkStatus.called = true
          }
          thortoise._checkActions()
          expect(mockStore.INFO).to.equal('action west test action')
          expect(checkStatus.called).to.equal(true)
          expect(checkStatus.action.action).to.equal('west')
        })
      })
      describe('when the action is "walk"', () => {
        it('should call the "walk" method and add to the INFO queue', () => {
          command.action = 'walk'
          thortoise.brain.commandQueue.addCommand(command)
          const checkStatus = {}
          thortoise.walk = (action) => {
            checkStatus.action = action
            checkStatus.called = true
          }
          thortoise._checkActions()
          expect(mockStore.INFO).to.equal('action walk test action')
          expect(checkStatus.called).to.equal(true)
          expect(checkStatus.action.action).to.equal('walk')
        })
      })
      describe('when the action is "goto"', () => {
        it('should call the "goto" method and add to the INFO queue', () => {
          command.action = 'goto'
          thortoise.brain.commandQueue.addCommand(command)
          const checkStatus = {}
          thortoise.goto = (action) => {
            checkStatus.action = action
            checkStatus.called = true
          }
          thortoise._checkActions()
          expect(mockStore.INFO).to.equal('action goto test action')
          expect(checkStatus.called).to.equal(true)
          expect(checkStatus.action.action).to.equal('goto')
        })
      })
      describe('when the action is "sleep"', () => {
        it('should call the "sleep" method and add to the INFO queue', () => {
          command.action = 'sleep'
          thortoise.brain.commandQueue.addCommand(command)
          const checkStatus = {}
          thortoise.sleep = (action) => {
            checkStatus.action = action
            checkStatus.called = true
          }
          thortoise._checkActions()
          expect(mockStore.INFO).to.equal('action sleep test action')
          expect(checkStatus.called).to.equal(true)
          expect(checkStatus.action.action).to.equal('sleep')
        })
      })
      describe('when the action is "start"', () => {
        it('should call the "start" method and add to the INFO queue', () => {
          command.action = 'start'
          thortoise.brain.commandQueue.addCommand(command)
          const checkStatus = {}
          thortoise.start = (action) => {
            checkStatus.action = action
            checkStatus.called = true
          }
          thortoise._checkActions()
          expect(mockStore.INFO).to.equal('action start test action')
          expect(checkStatus.called).to.equal(true)
          expect(checkStatus.action.action).to.equal('start')
        })
      })
      describe('when the action is "stop"', () => {
        it('should call the "stop" method and add to the INFO queue', () => {
          command.action = 'stop'
          thortoise.brain.commandQueue.addCommand(command)
          const checkStatus = {}
          thortoise.stop = (action) => {
            checkStatus.action = action
            checkStatus.called = true
          }
          thortoise._checkActions()
          expect(mockStore.INFO).to.equal('action stop test action')
          expect(checkStatus.called).to.equal(true)
          expect(checkStatus.action.action).to.equal('stop')
        })
      })
      describe('when the action is "kill"', () => {
        it('should call the "kill" method and add to the INFO queue', () => {
          command.action = 'kill'
          thortoise.brain.commandQueue.addCommand(command)
          const checkStatus = {}
          thortoise.kill = (action) => {
            checkStatus.action = action
            checkStatus.called = true
          }
          thortoise._checkActions()
          expect(mockStore.INFO).to.equal('action kill test action')
          expect(checkStatus.called).to.equal(true)
          expect(checkStatus.action.action).to.equal('kill')
        })
      })
      describe('when the action is "scan"', () => {
        it('should call the "scan" method and add to the INFO queue', () => {
          command.action = 'scan'
          thortoise.brain.commandQueue.addCommand(command)
          const checkStatus = {}
          thortoise.scan = (action) => {
            checkStatus.action = action
            checkStatus.called = true
          }
          thortoise._checkActions()
          expect(mockStore.INFO).to.equal('action scan test action')
          expect(checkStatus.called).to.equal(true)
          expect(checkStatus.action.action).to.equal('scan')
        })
      })
      describe('when the action is "turn"', () => {
        it('should call the "turn" method and add to the INFO queue', () => {
          command.action = 'turn'
          thortoise.brain.commandQueue.addCommand(command)
          const checkStatus = {}
          thortoise.turn = (action) => {
            checkStatus.action = action
            checkStatus.called = true
          }
          thortoise._checkActions()
          expect(mockStore.INFO).to.equal('action turn test action')
          expect(checkStatus.called).to.equal(true)
          expect(checkStatus.action.action).to.equal('turn')
        })
      })
    })
    describe('when the action type is "move', () => {
      describe('when the action is "right"', () => {
        it('should call the "right" method and add to the INFO queue', () => {
          command.type = 'move'
          command.action = 'right'
          thortoise.brain.commandQueue.addCommand(command)
          thortoise._checkActions()
          expect(thortoise.direction).to.equal('right')
        })
      })
      describe('when the action is "left"', () => {
        it('should call the "left" method and add to the INFO queue', () => {
          command.type = 'move'
          command.action = 'left'
          thortoise.brain.commandQueue.addCommand(command)
          thortoise._checkActions()
          expect(thortoise.direction).to.equal('left')
        })
      })
      describe('when the action is "backward"', () => {
        it('should call the "backward" method and add to the INFO queue', () => {
          command.type = 'move'
          command.action = 'backward'
          thortoise.brain.commandQueue.addCommand(command)
          thortoise._checkActions()
          expect(thortoise.direction).to.equal('backward')
        })
      })
      describe('when the action is "forward"', () => {
        it('should call the "forward" method and add to the INFO queue', () => {
          command.type = 'move'
          command.action = 'forward'
          thortoise.brain.commandQueue.addCommand(command)
          thortoise._checkActions()
          expect(thortoise.direction).to.equal('forward')
        })
      })
    })
  })
  describe('when _sleepLoop() is called', () => {
    it('should check actions to see if a command has come in from the API', () => {
      let checkActionsCalled = false
      thortoise._checkActions = () => { checkActionsCalled = true }
      thortoise._sleepLoop()
      expect(checkActionsCalled).to.equal(true)
    })
  })
  describe('when _runLoop() is called', () => {
    it('should check actions to see if a command has come in from the API', () => {
      let checkActionsCalled = false
      thortoise._checkActions = () => { checkActionsCalled = true }
      thortoise._runLoop()
      expect(checkActionsCalled).to.equal(true)
    })
    // it('should call _doMovement()', () => {
    //   let doMovementCalled = false
    //   thortoise._doMovement = () => { doMovementCalled = true }
    //   thortoise._runLoop()
    //   expect(doMovementCalled).to.equal(true)
    // })
    it('should call _verbose()', () => {
      let verboseCalled = false
      thortoise._verbose = () => { verboseCalled = true }
      thortoise._runLoop()
      expect(verboseCalled).to.equal(true)
    })
  })
  describe('when _addAction() is called', () => {
    it('should add an action to the commandQueue', () => {
      thortoise._addAction('test')
      const result = thortoise.brain.commandQueue.queue[0]
      expect(result.name).to.equal('test')
    })
    it('should add the command to the end of the queue', () => {
      thortoise._addAction('test')
      thortoise._addAction('test')
      thortoise._addAction('last')
      expect(thortoise.brain.commandQueue.queue.length).to.equal(3)
      const result = thortoise.brain.commandQueue.queue[2]
      expect(result.name).to.equal('last')
    })
  })
  describe('when north() is called', () => {
    beforeEach(() => {
      expectedCommand.notes = 'north'
    })
    describe('and the angle is negative', () => {
      it('should set the action to turn', () => {
        thortoise.brain.navigation.currentBearing = enums.EAST
        thortoise.north()
        expect(thortoise.action).to.deep.equal(expectedCommand)
      })
      it('should set the turnDirection to -1', () => {
        thortoise.brain.navigation.currentBearing = enums.EAST
        thortoise.north()
        expect(thortoise.turnDirection).to.equal(-1)
      })
      it('should set the desiredBearing to 0', () => {
        thortoise.north()
        expect(thortoise.desiredBearing).to.equal(0)
      })
    })
    describe('and the angle is positive', () => {
      it('should set the action to turn', () => {
        thortoise.brain.navigation.currentBearing = enums.EAST
        thortoise.north()
        expect(thortoise.action).to.deep.equal(expectedCommand)
      })
      it('should set the turnDirection to 1', () => {
        thortoise.brain.navigation.currentBearing = enums.WEST
        thortoise.north()
        expect(thortoise.turnDirection).to.equal(1)
      })
      it('should set the desiredBearing to 0', () => {
        thortoise.north()
        expect(thortoise.desiredBearing).to.equal(0)
      })
    })
  })
  describe('when east() is called', () => {
    beforeEach(() => {
      expectedCommand.notes = 'east'
    })
    describe('and the angle is negative', () => {
      it('should set the action to turn', () => {
        thortoise.brain.navigation.currentBearing = enums.SOUTH
        thortoise.east()
        expect(thortoise.action).to.deep.equal(expectedCommand)
      })
      it('should set the turnDirection to -1', () => {
        thortoise.brain.navigation.currentBearing = enums.SOUTH
        thortoise.east()
        expect(thortoise.turnDirection).to.equal(-1)
      })
      it('should set the desiredBearing to 0', () => {
        thortoise.east()
        expect(thortoise.desiredBearing).to.equal(90)
      })
    })
    describe('and the angle is positive', () => {
      it('should set the action to turn', () => {
        thortoise.brain.navigation.currentBearing = enums.NORTH
        thortoise.east()
        expect(thortoise.action).to.deep.equal(expectedCommand)
      })
      it('should set the turnDirection to 1', () => {
        thortoise.brain.navigation.currentBearing = enums.NORTH
        thortoise.east()
        expect(thortoise.turnDirection).to.equal(1)
      })
      it('should set the desiredBearing to 0', () => {
        thortoise.east()
        expect(thortoise.desiredBearing).to.equal(90)
      })
    })
  })
  describe('when south() is called', () => {
    beforeEach(() => {
      expectedCommand.notes = 'south'
    })
    describe('and the angle is negative', () => {
      it('should set the action to turn', () => {
        thortoise.brain.navigation.currentBearing = enums.WEST
        thortoise.south()
        expect(thortoise.action).to.deep.equal(expectedCommand)
      })
      it('should set the turnDirection to -1', () => {
        thortoise.brain.navigation.currentBearing = enums.WEST
        thortoise.south()
        expect(thortoise.turnDirection).to.equal(-1)
      })
      it('should set the desiredBearing to 0', () => {
        thortoise.south()
        expect(thortoise.desiredBearing).to.equal(180)
      })
    })
    describe('and the angle is positive', () => {
      it('should set the action to turn', () => {
        thortoise.brain.navigation.currentBearing = enums.EAST
        thortoise.south()
        expect(thortoise.action).to.deep.equal(expectedCommand)
      })
      it('should set the turnDirection to 1', () => {
        thortoise.brain.navigation.currentBearing = enums.EAST
        thortoise.south()
        expect(thortoise.turnDirection).to.equal(1)
      })
      it('should set the desiredBearing to 0', () => {
        thortoise.south()
        expect(thortoise.desiredBearing).to.equal(180)
      })
    })
  })
  describe('when west() is called', () => {
    beforeEach(() => {
      expectedCommand.notes = 'west'
    })
    describe('and the angle is negative', () => {
      it('should set the action to turn', () => {
        thortoise.brain.navigation.currentBearing = enums.NORTH
        thortoise.west()
        expect(thortoise.action).to.deep.equal(expectedCommand)
      })
      it('should set the turnDirection to -1', () => {
        thortoise.brain.navigation.currentBearing = enums.NORTH
        thortoise.west()
        expect(thortoise.turnDirection).to.equal(-1)
      })
      it('should set the desiredBearing to 0', () => {
        thortoise.west()
        expect(thortoise.desiredBearing).to.equal(270)
      })
    })
    describe('and the angle is positive', () => {
      it('should set the action to turn', () => {
        thortoise.brain.navigation.currentBearing = enums.SOUTH
        thortoise.west()
        expect(thortoise.action).to.deep.equal(expectedCommand)
      })
      it('should set the turnDirection to 1', () => {
        thortoise.brain.navigation.currentBearing = enums.SOUTH
        thortoise.west()
        expect(thortoise.turnDirection).to.equal(1)
      })
      it('should set the desiredBearing to 0', () => {
        thortoise.west()
        expect(thortoise.desiredBearing).to.equal(270)
      })
    })
  })
  describe('when goto() is called', () => {
    describe('and we haven\'t yet reached the destination', () => {
      it('should call navigation.solve()', () => {
        let navigationSolvedCalled = false
        thortoise.brain.navigation.solve = () => { navigationSolvedCalled = true }
        const mockAction = { coords: { x: 9, y: 9 } }
        thortoise.goto(mockAction)
        expect(navigationSolvedCalled).to.equal(true)
      })
    })
    describe('and we have reached the destination', () => {
      it('should return false', () => {
        thortoise.brain.navigation.solve = () => { }
        const mockAction = {
          coords: { x: 5, y: 5 }
        }
        const result = thortoise.goto(mockAction)
        expect(result).to.equal(false)
      })
    })
    describe('and we have a solved answer from the solver', () => {
      it('should call _goWhereYouAreNot()', () => {
        let goWhereYouAreNotCalled = false
        thortoise._goWhereYouAreNot = () => {
          goWhereYouAreNotCalled = true
        }
        const mockAction = {
          coords: { x: 3, y: 3 }
        }
        thortoise.goto(mockAction)
        expect(goWhereYouAreNotCalled).to.equal(true)
      })
      it('should call _addImmediateAction("goto")', () => {
        const addImmediateActionCalled = []
        thortoise._addImmediateAction = (value) => {
          addImmediateActionCalled.push(value)
        }
        const mockAction = {
          coords: { x: 3, y: 3 }
        }
        thortoise.goto(mockAction)
        expect(addImmediateActionCalled.indexOf('goto')).to.equal(1)
      })
      it('should call _addImmediateAction("walk")', () => {
        const addImmediateActionCalled = []
        thortoise._addImmediateAction = (value) => {
          addImmediateActionCalled.push(value)
        }
        const mockAction = {
          coords: { x: 3, y: 3 }
        }
        thortoise.goto(mockAction)
        expect(addImmediateActionCalled.indexOf('walk')).to.equal(2)
      })
    })
  })
  describe('when _goWhereYouAreNot() is called', () => {
    describe('and the place you want to go is north of you', () => {
      it('should add a "north" action to the start of the queue', () => {
        const whereYouAre = coords(5, 5)
        const whereYouAreNot = coords(5, 4)
        thortoise._goWhereYouAreNot(whereYouAre, whereYouAreNot)
        const nextAction = thortoise.brain.commandQueue.nextCommand()
        expect(nextAction.action).to.equal('north')
      })
    })
    describe('and the place you want to go is south of you', () => {
      it('should add a "north" action to the start of the queue', () => {
        const whereYouAre = coords(5, 5)
        const whereYouAreNot = coords(5, 6)
        thortoise._goWhereYouAreNot(whereYouAre, whereYouAreNot)
        const nextAction = thortoise.brain.commandQueue.nextCommand()
        expect(nextAction.action).to.equal('south')
      })
    })
    describe('and the place you want to go is east of you', () => {
      it('should add a "east" action to the start of the queue', () => {
        const whereYouAre = coords(5, 5)
        const whereYouAreNot = coords(6, 5)
        thortoise._goWhereYouAreNot(whereYouAre, whereYouAreNot)
        const nextAction = thortoise.brain.commandQueue.nextCommand()
        expect(nextAction.action).to.equal('east')
      })
    })
    describe('and the place you want to go is west of you', () => {
      it('should add a "east" action to the start of the queue', () => {
        const whereYouAre = coords(5, 5)
        const whereYouAreNot = coords(4, 5)
        thortoise._goWhereYouAreNot(whereYouAre, whereYouAreNot)
        const nextAction = thortoise.brain.commandQueue.nextCommand()
        expect(nextAction.action).to.equal('west')
      })
    })
    describe('and any direction is chosen', () => {
      it('should add a second command to go "forward"', () => {
        const whereYouAre = coords(5, 5)
        const whereYouAreNot = coords(4, 5)
        thortoise._goWhereYouAreNot(whereYouAre, whereYouAreNot)
        const nextAction = thortoise.brain.commandQueue.nextCommand()
        expect(nextAction.action).to.equal('west')
        const secondAction = thortoise.brain.commandQueue.nextCommand()
        expect(secondAction.action).to.equal('forward')
      })
    })
  })
  describe('when turn() is called', () => {
    describe('when a bearing is provided', () => {
      it('should set the desiredBearing from the provided bearign', () => {
        const options = {
          ...commandOptions,
          bearing: 80
        }
        const mockCommand = new Command(options)
        thortoise.turn(mockCommand)
        expect(thortoise.desiredBearing).to.equal(80)
      })
    })
    describe('when a bearing is not provided', () => {
      describe('and a coords point is provided', () => {
        it('should calculate the bearing from the point coordingates', () => {
          const options = {
            ...commandOptions,
            coords: { x: 9, y: 9 }
          }
          const mockCommand = new Command(options)
          thortoise.turn(mockCommand)
          expect(thortoise.desiredBearing).to.equal(135)
        })
      })
    })
    describe('when the turnDirection is less than zero', () => {
      it('should set the turn direction to "left"', () => {
        const options = {
          ...commandOptions,
          coords: { x: 9, y: 9 }
        }
        const mockCommand = new Command(options)
        thortoise.turnDirection = -1
        thortoise.turn(mockCommand)
        expect(thortoise.direction).to.equal('left')
      })
    })

    describe('when the turnDirection is more than zero', () => {
      it('should set the turn direction to "right"', () => {
        const options = {
          ...commandOptions,
          coords: { x: 9, y: 9 }
        }
        const mockCommand = new Command(options)
        thortoise.turnDirection = 1
        thortoise.turn(mockCommand)
        expect(thortoise.direction).to.equal('right')
      })
    })

    describe('when the currentBearing matches the desired bearing', () => {
      it('should log "turn complete"', () => {
        thortoise.brain.navigation.currentBearing = 135
        const options = {
          ...commandOptions,
          coords: { x: 9, y: 9 }
        }
        const mockCommand = new Command(options)
        thortoise.turn(mockCommand)
        expect(mockStore.INFO).to.equal('turn complete')
      })
      it('should call _addImmediateAction and set the next action to "scan"', () => {
        thortoise.brain.navigation.currentBearing = 135
        const options = {
          ...commandOptions,
          coords: { x: 9, y: 9 }
        }
        const mockCommand = new Command(options)
        const addImmediateActionCalled = {}
        thortoise._addImmediateAction = (action) => {
          addImmediateActionCalled.action = action
        }
        thortoise.turn(mockCommand)
        expect(addImmediateActionCalled.action).to.equal('scan')
      })
    })

    describe('when the currentBearing does not match the desired bearing', () => {
      it('should add another turn command to the queue', () => {
        thortoise.brain.navigation.currentBearing = 135
        const options = {
          ...commandOptions,
          coords: { x: 8, y: 9 }
        }
        const mockCommand = new Command(options)
        const addImmediateActionCalled = {}
        thortoise._addImmediateAction = (action) => {
          addImmediateActionCalled.action = action
        }
        thortoise.turn(mockCommand)
        expect(addImmediateActionCalled.action).to.equal('turn')
      })
    })
  })
  describe('when scan() is called', () => {
    it('should call the camera "getImage()" method', () => {
      let getImageCalled = false
      thortoise.brain.camera.getImage = () => { getImageCalled = true }
      thortoise.scan()
      expect(getImageCalled).to.equal(true)
    })
  })
})
