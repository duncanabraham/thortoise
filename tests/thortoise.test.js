/* global describe, it, xit, before, after, beforeEach */
const { expect } = require('chai')

const { mockDriver } = require('./mocks')
const Leg = require('../lib/leg')
const Brain = require('../lib/brain')
const path = require('path')
const mock = require('mock-require')
const enums = require('../lib/enums')
const { Command } = require('../lib/command')

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

const legDefaults = {
  femurLength: 150,
  tibiaLength: 150,
  hipServoSettings: this.hipServo,
  femurServoSettings: this.femurServo,
  kneeServoSettings: this.kneeServo,
  direction: 'forward'
}

const servos = {
  hipServoSettings: { range: [40, 90], startAt: 90, controller: 'PCA9685' },
  femurServoSettings: { range: [20, 120], startAt: 120, controller: 'PCA9685' },
  kneeServoSettings: { range: [40, 90], startAt: 90, controller: 'PCA9685' }
}

const cameraSettings = {
  mode: 'photo',
  output: `(${path.join(__dirname, 'image.jpg')}`,
  width: 640,
  height: 480,
  nopreview: true
}

let mockStore = {}

const mockOptions = {
  name: 'testbot',
  version: 1,
  driver: mockDriver,
  cameraSettings,
  store: {
    append: (key, value) => { mockStore[key] = value }
  },
  legSettings: [
    { id: 0, name: 'front-left', startPos: 0, ...legDefaults, ...servos },
    { id: 1, name: 'front-right', startPos: Math.PI / 2, ...legDefaults, ...servos },
    { id: 2, name: 'back-left', startPos: Math.PI, ...legDefaults, ...servos },
    { id: 3, name: 'back-right', startPos: Math.PI * 1.5, ...legDefaults, ...servos }
  ]
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
      info: () => { }
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
    it('should initialise 4 legs as an array', () => {
      const { legs } = thortoise
      expect(legs).to.be.an('Array')
      expect(legs.length).to.equal(4)
      expect(legs[0]).to.be.an.instanceOf(Leg)
    })
    it('should add an instance of Brain', () => {
      const { brain } = thortoise
      expect(brain).to.be.an.instanceOf(Brain)
    })
    it('should set the timer value to 20', () => {
      expect(thortoise.loopSpeedMS).to.equal(20)
    })
  })
  describe('when sleep() is called', () => {
    it('should set all legs to sleep mode', () => {
      thortoise.sleeping = undefined
      const result = {}
      function sleep () {
        result[this.name] = 'leg sleep called'
      }
      thortoise.legs.forEach(leg => { leg.sleep = (sleep.bind(leg)) })
      thortoise.sleep()
      const expectedResult = {
        'front-left': 'leg sleep called',
        'front-right': 'leg sleep called',
        'back-left': 'leg sleep called',
        'back-right': 'leg sleep called'
      }
      expect(result).to.deep.equal(expectedResult)
    })
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
        console.log('thortoise: ', thortoise)
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
  describe('when exitHandler is called', () => {
    it('should call stop() on all legs', () => {
      thortoise.exitHandler()
    })
    it('should store the value "Stopped" in the INFO log', () => {
      thortoise.exitHandler()
      expect(mockStore.INFO).to.equal('Stopped')
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
      const expectedResult = '{"direction":"forward","currentAction":"","action":"","steps":72,"loopSpeedMS":20,"step":0,"name":"testbot","version":1,"heartbeat":true,"legs":[{"steps":72,"id":0,"name":"front-left","startPos":0,"femurLength":150,"tibiaLength":150,"hipServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"femurServoSettings":{"range":[20,120],"startAt":120,"controller":"PCA9685"},"kneeServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"direction":"forward","driver":{},"servos":{"hip":{"pin":0,"name":"hip0","range":[40,90],"startAt":90,"controller":"PCA9685"},"femur":{"pin":1,"name":"femur0","range":[20,120],"startAt":120,"controller":"PCA9685"},"knee":{"pin":2,"name":"knee0","range":[40,90],"startAt":90,"controller":"PCA9685"}},"baseId":0,"step":0,"position":{"t1":90,"t2":120,"t3":90,"name":"front-left","startPos":0,"distanceFromHipToFoot":0,"angleAtFemur":0,"angleAtKnee":0,"angleAtHip":0,"femurLength":150,"tibiaLength":150,"position":{"t1":55,"t2":55,"t3":-205},"groundClearance":-205,"footX":55,"footY":55}},{"steps":72,"id":1,"name":"front-right","startPos":1.5707963267948966,"femurLength":150,"tibiaLength":150,"hipServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"femurServoSettings":{"range":[20,120],"startAt":120,"controller":"PCA9685"},"kneeServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"direction":"forward","driver":{},"servos":{"hip":{"pin":3,"name":"hip3","range":[40,90],"startAt":90,"controller":"PCA9685"},"femur":{"pin":4,"name":"femur3","range":[20,120],"startAt":120,"controller":"PCA9685"},"knee":{"pin":5,"name":"knee3","range":[40,90],"startAt":90,"controller":"PCA9685"}},"baseId":3,"step":0,"position":{"t1":90,"t2":120,"t3":90,"name":"front-right","startPos":1.5707963267948966,"distanceFromHipToFoot":0,"angleAtFemur":0,"angleAtKnee":0,"angleAtHip":0,"femurLength":150,"tibiaLength":150,"position":{"t1":55,"t2":55,"t3":-205},"groundClearance":-205,"footX":55,"footY":55}},{"steps":72,"id":2,"name":"back-left","startPos":3.141592653589793,"femurLength":150,"tibiaLength":150,"hipServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"femurServoSettings":{"range":[20,120],"startAt":120,"controller":"PCA9685"},"kneeServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"direction":"forward","driver":{},"servos":{"hip":{"pin":6,"name":"hip6","range":[40,90],"startAt":90,"controller":"PCA9685"},"femur":{"pin":7,"name":"femur6","range":[20,120],"startAt":120,"controller":"PCA9685"},"knee":{"pin":8,"name":"knee6","range":[40,90],"startAt":90,"controller":"PCA9685"}},"baseId":6,"step":0,"position":{"t1":90,"t2":120,"t3":90,"name":"back-left","startPos":3.141592653589793,"distanceFromHipToFoot":0,"angleAtFemur":0,"angleAtKnee":0,"angleAtHip":0,"femurLength":150,"tibiaLength":150,"position":{"t1":55,"t2":55,"t3":-205},"groundClearance":-205,"footX":55,"footY":55}},{"steps":72,"id":3,"name":"back-right","startPos":4.71238898038469,"femurLength":150,"tibiaLength":150,"hipServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"femurServoSettings":{"range":[20,120],"startAt":120,"controller":"PCA9685"},"kneeServoSettings":{"range":[40,90],"startAt":90,"controller":"PCA9685"},"direction":"forward","driver":{},"servos":{"hip":{"pin":9,"name":"hip9","range":[40,90],"startAt":90,"controller":"PCA9685"},"femur":{"pin":10,"name":"femur9","range":[20,120],"startAt":120,"controller":"PCA9685"},"knee":{"pin":11,"name":"knee9","range":[40,90],"startAt":90,"controller":"PCA9685"}},"baseId":9,"step":0,"position":{"t1":90,"t2":120,"t3":90,"name":"back-right","startPos":4.71238898038469,"distanceFromHipToFoot":0,"angleAtFemur":0,"angleAtKnee":0,"angleAtHip":0,"femurLength":150,"tibiaLength":150,"position":{"t1":55,"t2":55,"t3":-205},"groundClearance":-205,"footX":55,"footY":55}}]}'
      expect(result).to.equal(expectedResult)
    })
  })
  describe('when the _tock() method is called', () => {
    it('should increment the step counter', () => {
      thortoise._tock()
      expect(thortoise.step).to.equal(1)
    })
    describe('when the step counter equals the maximum steps', () => {
      it('should reset the step counter to zero', () => {
        thortoise.step = thortoise.steps - 1
        thortoise._tock()
        expect(thortoise.step).to.equal(0)
      })
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
  describe('when _doMovement() is called', () => {
    let result
    beforeEach(() => {
      result = {
        nextStep: {},
        setDirection: {}
      }
      thortoise.legs.forEach((leg) => {
        leg.nextStep = () => {
          result.nextStep[leg.name] = 'nextStep called'
        }
        leg.setDirection = (direction) => {
          result.setDirection[leg.name] = direction
        }
      })
    })
    describe('and the direction is "forward"', () => {
      it('should set all legs to forward', () => {
        thortoise.direction = 'forward'
        thortoise._doMovement()
        expect(result.setDirection['front-right']).to.equal('forward')
        expect(result.setDirection['front-left']).to.equal('forward')
        expect(result.setDirection['back-right']).to.equal('forward')
        expect(result.setDirection['back-left']).to.equal('forward')
      })
    })
    describe('and the direction is "backward"', () => {
      it('should set all legs to backward', () => {
        thortoise.direction = 'backward'
        thortoise._doMovement()
        expect(result.setDirection['front-right']).to.equal('backward')
        expect(result.setDirection['front-left']).to.equal('backward')
        expect(result.setDirection['back-right']).to.equal('backward')
        expect(result.setDirection['back-left']).to.equal('backward')
      })
    })
    describe('and the direction is "left', () => {
      it('should set the left legs to "forward"', () => {
        thortoise.direction = 'left'
        thortoise._doMovement()
        expect(result.setDirection['front-left']).to.equal('forward')
        expect(result.setDirection['back-left']).to.equal('forward')
      })
      it('should set the right legs to "backward"', () => {
        thortoise.direction = 'left'
        thortoise._doMovement()
        expect(result.setDirection['front-right']).to.equal('backward')
        expect(result.setDirection['back-right']).to.equal('backward')
      })
    })
    describe('and the direction is "right', () => {
      it('should set the left legs to "backward"', () => {
        thortoise.direction = 'right'
        thortoise._doMovement()
        expect(result.setDirection['front-left']).to.equal('backward')
        expect(result.setDirection['back-left']).to.equal('backward')
      })
      it('should set the right legs to "forward"', () => {
        thortoise.direction = 'right'
        thortoise._doMovement()
        expect(result.setDirection['front-right']).to.equal('forward')
        expect(result.setDirection['back-right']).to.equal('forward')
      })
    })
    it('should call the nextStep() method for all legs', () => {
      thortoise._doMovement()
      expect(result.nextStep['front-right']).to.equal('nextStep called')
      expect(result.nextStep['front-left']).to.equal('nextStep called')
      expect(result.nextStep['back-right']).to.equal('nextStep called')
      expect(result.nextStep['back-left']).to.equal('nextStep called')
    })
  })
  describe('when _verbose() is called and the verbose flag is set', () => {
    it('should update the store DATA log with the current kinematics', () => {
      thortoise.verbose = true
      thortoise._doMovement()
      thortoise._verbose()
      const expectedData = '{"front-left":{"t1":159,"t2":125,"t3":62},"front-right":{"t1":165,"t2":87,"t3":118},"back-left":{"t1":168,"t2":104,"t3":132},"back-right":{"t1":165,"t2":148,"t3":85}}'
      expect(mockStore.DATA).to.equal(expectedData)
    })
  })
  describe('when _checkActions() is called', () => {
    xit('should see what needs to happen next')
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
    it('should call _tock()', () => {
      let tockCalled = false
      thortoise._tock = () => { tockCalled = true }
      thortoise._runLoop()
      expect(tockCalled).to.equal(true)
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
      it('should call _addImmediateAction("walk")', () => {
        const addImmediateActionCalled = []
        thortoise._addImmediateAction = (value) => {
          addImmediateActionCalled.push(value)
        }
        const mockAction = {
          coords: { x: 3, y: 3 }
        }
        thortoise.goto(mockAction)
        expect(addImmediateActionCalled.indexOf('walk')).to.equal(1)
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
        expect(addImmediateActionCalled.indexOf('goto')).to.equal(2)
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
      it('should use the current desiredBearing')
    })
  })
})
