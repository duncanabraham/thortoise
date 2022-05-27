class Controllers {
  /**
   * Options contains robot - the thing we're controlling, and app which is the express app we're using for control
   * @param {*} options
   */
  constructor (options) {
    Object.assign(this, options)
    this.app.all('*', this.handler.bind(this))
  }

  handler (req, res) {
    const { method, body, query, url, params } = req
    // console.log('url: ', url)
    // console.log('method: ', method)
    // console.log('body: ', body)
    // console.log('query: ', query)
    // console.log('params: ', params)

    const { action } = body || undefined
    if (action) {
      this.robot.action = action
    }
    res.sendStatus(200)
  }
}

module.exports = Controllers
