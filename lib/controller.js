const { Command } = require('./command')
const favicon = require('serve-favicon')
const path = require('path')
class Controller {
  /**
   * Options contains robot - the thing we're controlling, and app which is the express app we're using for control
   * @param {*} options
   */
  constructor (options) {
    Object.assign(this, options)
    this.app.use(favicon(path.join(__dirname, '/public/favicon.ico')))
    this.app.all('*', this.handler.bind(this))
  }

  /**
   * It takes the request, and based on the URL, returns a response
   * @param req - The request object
   * @param res - the response object
   * @returns The response is being returned.
   */
  getHandler (req, res) {
    const { params } = req
    let response
    switch (params[0]) {
      case '/api/map':
        response = this.robot.saveWorld()
        break
      case '/api/commands':
        response = this.robot.commands
        break
      case '/api/dump':
        response = this.robot.export
        break
      case '/api/state':
        response = this.robot.state
        break
      case '/api/errors':
        response = this.robot.store.get('ERRORS') || []
        break
      case '/api/info':
        response = this.robot.store.get('INFO') || []
        break
      default:
        response = 'do what??'
    }
    return res.send(response)
  }

  /**
   * It takes the body of the request, creates a new command object, adds it to the command queue, and
   * sends a 200 status code back to the client
   * @param req - The request object
   * @param res - The response object
   * @returns The response status code.
   */
  handler (req, res) {
    const { body } = req
    if (req.method === 'GET') {
      return this.getHandler(req, res)
    }
    const command = new Command(body || {})
    command.origin = 'human'
    const { commandQueue } = this.robot.brain
    commandQueue.addImmediateCommand(command)
    res.sendStatus(200)
  }
}

module.exports = Controller
