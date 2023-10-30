const HttpClient = require('./webtalk')
const httpClient = new HttpClient()
const log = require('./log')
const { options } = require('../config')
let zeroApiUrl
if (options.env === 'dev') {
  zeroApiUrl = 'http://localhost/data'
} else {
  zeroApiUrl = 'http://192.168.1.102/data'
}

class Tracks {
  constructor (options) {
    Object.assign(this, options)
  }

  async sendCommand (motors) {
    const data = {
      speedLeft: motors[0],
      speedRight: motors[1],
      state: motors[0] !== 0 && motors[1] !== 0 ? 1 : 0
    }
    await httpClient.post(zeroApiUrl, data, {}).catch(e => {
      log.error('error writing to API', e)
    })
  }

  async move (direction) {
    const motors = [0, 0]
    switch (direction) { // 20 and -20 represents 20% of max speed.  Where is the speed stored?
      case 'left':
        motors[1] = 20
        motors[0] = -20
        break
      case 'right':
        motors[0] = 20
        motors[1] = -20
        break
      case 'forward':
        motors[1] = 20
        motors[0] = 20
        break
      case 'backward':
        motors[1] = -20
        motors[0] = -20
        break
      default:
        return await this.stop()
    }
    await this.sendCommand(motors)
  }

  async stop () {
    const motors = [0, 0]
    await this.sendCommand(motors)
  }
}

module.exports = Tracks
