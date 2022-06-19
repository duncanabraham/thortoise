const { exec } = require('child_process')
const { SHUTDOWN_ERROR } = require('./errors')

module.exports = {
  shutdown: () => {
    exec('shutdown -h now', (error, out) => {
      if (error) {
        console.error(SHUTDOWN_ERROR('thortoise', error.message))
      } else {
        console.info(`Shutdown command sent: ${out}`)
      }
    })
    console.log('haha!')
  }
}
