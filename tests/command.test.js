const { expect } = require('chai')
const { CommandQueue, Command } = require('../lib/command')

describe('The Command Library', () => {
  describe('The Command class', () => {
    let command
    beforeEach(() => {
      command = new Command({ name: 'something' })
    })
    it('should store values passed to it', () => {
      expect(command.name).to.equal('something')
    })

    it('when asString() is called, it should return itself as a JSON string', () => {
      const result = command.asString()
      expect(result).to.equal('{"name":"something","action":"","origin":""}')
    })

    it('when fromString() is called, it should set it\'s own values from a JSON string', () => {
      const jsonString = '{"name":"something","action":"sleep","origin":"human"}'
      command.fromString(jsonString)
      expect(command.name).to.equal('something')
      expect(command.action).to.equal('sleep')
      expect(command.origin).to.equal('human')
    })

    it('when equals() is called, it should return false if the compared command is different', () => {
      const testCommand = new Command({ name: 'something', action: 'test' })
      expect(command.equals(testCommand)).to.equal(false)
    })

    it('when equals() is called, it should return true if the compared command is the same', () => {
      const testCommand = new Command({ name: 'something' })
      expect(command.equals(testCommand)).to.equal(true)
    })
  })

  describe('The CommandQueue class', () => {
    let commandQueue
    beforeEach(() => {
      commandQueue = new CommandQueue()
    })
    describe('when addCommand() is called', () => {
      it('should allow a command to be added to a queue', () => {
        const command = new Command({ name: 'test command', action: 'sleep', origin: 'human' })
        commandQueue.addCommand(command)
        commandQueue.addCommand(command)
        expect(commandQueue.count()).to.equal(2)
      })
    })
    describe('when clearCommands() is called', () => {
      it('should clear all the commands', () => {
        const command = new Command({ name: 'test command', action: 'sleep', origin: 'human' })
        commandQueue.addCommand(command)
        commandQueue.addCommand(command)
        commandQueue.clearCommands()
        expect(commandQueue.count()).to.equal(0)
      })
    })
    describe('when nextCommand() is called', () => {
      it('should return a "do nothing" command if the queue is empty', () => {
        const result = commandQueue.nextCommand()
        expect(result.name).to.equal('Do Nothing')
      })
      it('should return the first item from the queue if the queue has items', () => {
        const command1 = new Command({ name: 'test command 1', action: 'sleep', origin: 'human' })
        const command2 = new Command({ name: 'test command 2', action: 'sleep', origin: 'human' })
        const command3 = new Command({ name: 'test command 3', action: 'sleep', origin: 'human' })
        commandQueue.addCommand(command1)
        commandQueue.addCommand(command2)
        commandQueue.addCommand(command3)
        expect(commandQueue.count()).to.equal(3)
        const result = commandQueue.nextCommand()
        expect(result.equals(command1)).to.equal(true)
      })

    })
    describe('when nextHumanCommand() is called', () => {
      it('should return a "undefined" command the queue is empty', () => {
        const result = commandQueue.nextHumanCommand()
        expect(result).to.equal(undefined)
      })
      it('should return a "undefined" command the queue has no human origin items', () => {
        const command1 = new Command({ name: 'test command 1', action: 'sleep', origin: 'machine' })
        const command2 = new Command({ name: 'test command 2', action: 'sleep', origin: 'machine' })
        const command3 = new Command({ name: 'test command 3', action: 'sleep', origin: 'machine' })
        commandQueue.addCommand(command1)
        commandQueue.addCommand(command2)
        commandQueue.addCommand(command3)
        const result = commandQueue.nextHumanCommand()
        expect(result).to.equal(undefined)
      })
      it('should return the first human origin item from the queue if the queue has items', () => {
        const command1 = new Command({ name: 'test command 1', action: 'sleep', origin: 'machine' })
        const command2 = new Command({ name: 'test command 2', action: 'sleep', origin: 'human' })
        const command3 = new Command({ name: 'test command 3', action: 'sleep', origin: 'machine' })
        commandQueue.addCommand(command1)
        commandQueue.addCommand(command2)
        commandQueue.addCommand(command3)
        const result = commandQueue.nextHumanCommand()
        expect(result.equals(command2)).to.equal(true)
      })
    })
    describe('when shuffle() is called', () => {
      it('should leave the queue unchanged if there are no human commands', () => {
        const command = new Command({ name: 'test command', action: 'sleep', origin: 'machine' })
        commandQueue.addCommand(command)
        commandQueue.addCommand(command)
        expect(commandQueue.count()).to.equal(2)
        const originalQueue = commandQueue.queue
        commandQueue.shuffle()
        expect(commandQueue.queue).to.equal(originalQueue)
      })
      it('should move the first human command to the start of the queue if there is a human command', () => {
        const command1 = new Command({ name: 'test command 1', action: 'sleep', origin: 'machine' })
        const command2 = new Command({ name: 'test command 2', action: 'sleep', origin: 'human' })
        commandQueue.addCommand(command1)
        commandQueue.addCommand(command2)
        expect(commandQueue.count()).to.equal(2)
        commandQueue.shuffle()
        const result = commandQueue.nextCommand()
        expect(result.equals(command2)).to.equal(true)
      })
    })
    describe('when addImmediateCommand() is called', () => {
      it('should add a new command to the front of the queue', () => {
        // Add some items to the queue
        const command = new Command({ name: 'test command 1', action: 'sleep', origin: 'human' })
        commandQueue.addCommand(command)
        commandQueue.addCommand(command)
        expect(commandQueue.count()).to.equal(2) // check there are only 2

        // Add a new command to the start of the queue
        const newCommand = new Command({ name: 'test command 2', action: 'sleep', origin: 'human' })
        commandQueue.addImmediateCommand(newCommand)
        expect(commandQueue.count()).to.equal(3) // check there are now 3 items

        // Get the first command from the queue
        const result = commandQueue.nextCommand()
        expect(result.equals(newCommand)).to.equal(true)
      })
    })
  })
})