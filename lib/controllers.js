const { Command } = require('./command')
class Controllers {
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
    // const { method, query, url, params } = req
    // console.log('url: ', url)
    // console.log('method: ', method)
    // console.log('body: ', body)
    // console.log('query: ', query)
    // console.log('params: ', params)

    const command = new Command(body || {})
    command.origin = 'human'
    this.robot.commandQueue.addImmediateCommand(command)
    res.sendStatus(200)
  }
}

module.exports = Controllers
