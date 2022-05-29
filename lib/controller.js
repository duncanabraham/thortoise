const { Command } = require('./command')
class Controller {
  /**
   * Options contains robot - the thing we're controlling, and app which is the express app we're using for control
   * @param {*} options
   */
  constructor(options) {
    Object.assign(this, options)
    this.app.all('*', this.handler.bind(this))
  }

  handler(req, res) {
    const { body } = req
    const command = new Command(body || {})
    command.origin = 'human'
    this.robot.commandQueue.addImmediateCommand(command)
    res.sendStatus(200)
  }
}

module.exports = Controller
