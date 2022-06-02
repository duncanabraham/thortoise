const { Command } = require('./command')
const favicon = require('serve-favicon')
class Controller {
  /**
   * Options contains robot - the thing we're controlling, and app which is the express app we're using for control
   * @param {*} options
   */
  constructor(options) {
    Object.assign(this, options)
    this.app.use(favicon(__dirname + '/public/favicon.ico'))
    this.app.all('*', this.handler.bind(this))
  }

  getHandler(req, res) {
    const { params } = req
    let data
    switch(params[0]) {
      case '/api/map':
        data = this.robot.navigation.saveWorld()
        break
      case '/api/commands':
        data =this.robot.commands
        break
      case '/api/dump':
        data = this.robot.export
        break
      case '/api/state':
        data = this.robot.state
        break
      case '/api/errors':
        data = this.robot.store.get('ERRORS') || []
        break
      case '/api/info':
        data = this.robot.store.get('INFO') || []
        break
      default:
        data = 'do what??'
    }
    return res.send(data)
  }

  handler(req, res) {
    const { body } = req
    if (req.method === 'GET') {
      return this.getHandler(req, res)
    }
    const command = new Command(body || {})
    command.origin = 'human'
    const { commandQueue } = this.robot
    commandQueue.addImmediateCommand(command)
    res.sendStatus(200)
  }
}

module.exports = Controller
