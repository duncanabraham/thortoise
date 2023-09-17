const { exec } = require('child_process')
const { SHUTDOWN_ERROR } = require('./errors')
const log = require('./log')
module.exports = {
  shutdown: () => {
    exec('shutdown -h now', (error, out) => {
      if (error) {
        log.error(SHUTDOWN_ERROR('thortoise', error.message))
      } else {
        console.info(`Shutdown command sent: ${out}`)
      }
    })
  }
}
