// Enums for Command
const Origin = {
  HUMAN: 'human',
  MACHINE: 'machine'
}

/**
 * An action:
 *  - name: string describing the action
 *  - action: a string command
 *  - origin: human or machine
 */
class Command {
  /**
   * A command has:
   * - a name
   * - an action
   * - an origin which is from `Origin`
   * @param {Command} options
   */
  constructor (options = {}) {
    this.name = 'Do Nothing'
    this.action = ''
    this.origin = Origin.MACHINE // human || machine
    Object.assign(this, options)
  }

  asString () {
    return JSON.stringify(this)
  }

  fromString (s) {
    const options = JSON.parse(s)
    Object.assign(this, options)
  }

  equals (c) {
    return Object.entries(c).toString() === Object.entries(this).toString()
  }
}

class CommandQueue {
  constructor (options = {}) {
    Object.assign(this, options)
    this.queue = []
  }

  /**
   * Return the next command to run
   * @returns {Command} the next command to run
   */
  nextCommand () {
    return this.count() > 0 ? this.queue.shift() : new Command()
  }

  /**
   * Get the next command added by a human
   * Human commands could be processed before machine commands
   */
  nextHumanCommand () {
    const thisCommand = this.queue.find(i => i.origin === 'human')
    if (thisCommand) {
      this.queue = this.queue.filter(i => !i.equals(thisCommand))
      return thisCommand
    }
  }

  /**
   * Take the next human command and move it to the front of the queue
   */
  shuffle () {
    const thisCommand = this.nextHumanCommand()
    if (thisCommand) {
      this.addImmediateCommand(thisCommand)
    }
  }

  /**
   * Add a command to the end of the queue
   * @param {Command} c
   */
  addCommand (c) {
    this.queue.push(c)
  }

  /**
   * Add a command to the start of the queue
   * @param {Command} c
   */
  addImmediateCommand (c) {
    this.queue.unshift(c)
  }

  /**
   * Empty the queue
   */
  clearCommands () {
    this.queue = []
  }

  /**
   * How many items are in the queue
   * @returns {number} a count of the number of items in the queue
   */
  count () {
    return this.queue.length
  }
}

module.exports = {
  CommandQueue,
  Command,
  Origin
}
