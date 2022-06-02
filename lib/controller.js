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
        return res.send(this.robot.navigation.saveWorld())
        break
      case '/api/commands':
        return res.send(this.robot.commands)
        break
      case '/api/dump':
        return res.send(this.robot.export)
        break
      case '/api/state':
        return res.send(this.robot.state)
        break
      default:
        return res.send('do what??')
    }
  }

  handler(req, res) {
    const { body } = req
    if (req.method === 'GET') {
      return this.getHandler(req, res)
    }
    const command = new Command(body || {})
    command.origin = 'human'
    this.robot.commandQueue.addImmediateCommand(command)
    res.sendStatus(200)
  }
}

module.exports = Controller
