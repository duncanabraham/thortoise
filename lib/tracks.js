const Feature = require('./feature')
const trackApi = require('./api')

const featureOptions = {
  type: 'OPTIONAL',
  group: 'MOTION',
  resumeHandler: () => { },
  pauseHandler: () => { }
}

/**
 * Define the movement of a track in terms of on/off speed and direction
 */
class Track { // should implement API calls to pico
  constructor (options) {
    Object.assign(this, options)
  }

  forward () {
    trackApi.write('options', {
      // not sure yet what the options are to move this forward
    })
  }

  backward () {
    trackApi.write('options', {
      // not sure yet what the options are to move this backwards
    })
  }

  stop () {
    trackApi.write('options', {
      // not sure yet what the options are to stop this
    })
  }
}

class Tracks extends Feature {
  constructor (options) {
    super(featureOptions)
    Object.assign(this, options)
    this.tracks = []
    Object.keys(this.settings).forEach(key => {
      this.tracks.push(new Track(this.settings[key]))
    })
  }

  forward () {
    this.tracks.forEach(track => track.forward())
  }

  backward () {
    this.tracks.forEach(track => track.backward())
  }

  stop () {
    this.tracks.forEach(track => track.stop())
  }

  left () {
    this.tracks[0].forward()
    this.tracks[1].backward()
  }

  right () {
    this.tracks[1].backward()
    this.tracks[0].forward()
  }
}

module.exports = Tracks
