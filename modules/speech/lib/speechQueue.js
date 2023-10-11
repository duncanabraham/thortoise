const redis = require('redis')
const { exec } = require('child_process')

const soundFiles = require('./sound.json')

class SpeechQueue {
  constructor(options) {
    this._queue = {}
    this.currentlySpeaking = false
    this.subscriber = options.redisClient.sub
    this._initializeRedis()
    this.maxAge = options.maxAge || 1000 * 60 * 3 // 3 minutes
  }

  _initializeRedis() {
    this.subscriber.on('error', (err) => {
      console.error(`\x1b[31mRedis error:\x1b[0m ${err}`)
    })

    this.subscriber.subscribe('voice', this._addMessageToQueue.bind(this))
  }

  _validateAndSanitizeText(text) {
    // Escape double quotes and backslashes to prevent command injection
    const sanitizedText = text.replace(/(["\\])/g, '\\$1')
    return sanitizedText
  }

  _handleCommand(command) {
    switch (command) {
      case 'CLEAR':
        this.clearQueue()
        break
      case 'BEEP':
        exec(`aplay ${soundFiles.BEEP}`, this._postSoundCommand.bind(this))
        break
      case 'BOOP':
        exec(`aplay ${soundFiles.Boop}`, this._postSoundCommand.bind(this))
        break
      default:
        console.error(`Unknown command: ${command}`)
    }
  }

  _addMessageToQueue(message) {
    console.log('message: ', message)
    
    const voiceObject = JSON.parse(message)
    const { text, timestamp, command } = voiceObject
    if (command) {
      this._handleCommand(command)
      return
    }
    const sanitizedText = this._validateAndSanitizeText(text)
    if (!sanitizedText) {
      console.error('Invalid text received')
      return
    }
    this._queue[timestamp] = sanitizedText
    // this._pruneOldMessages()
    console.log('about to speak')
    if (!this.currentlySpeaking) {
      console.log('calling _speak()')
      this._speak()
    }
  }

  _pruneOldMessages() {
    const old = Date.now() - this.maxAge
    Object.keys(this._queue).forEach(key => {
      if (key < old) {
        delete this._queue[key]
      }
    })
  }

  _speak() {
    console.log('entered speak()')
    if (Object.keys(this._queue).length === 0) {
      return
    }
    this.currentlySpeaking = true
    const oldestTimestamp = Math.min(...Object.keys(this._queue))
    const textToSpeak = this._queue[oldestTimestamp]
    console.log('textToSpeak: ', textToSpeak)
    delete this._queue[oldestTimestamp]
    console.log('deleted item from queue')
    console.log('about to exec espeak ...')
    const espeakCommand = `espeak --stdout -s 80 -p 50 "${textToSpeak}" | sox -t wav - -c 2 -t wav - | aplay`
    exec(espeakCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error in speaking: ${error}`)
        return
      }
      this.currentlySpeaking = false
      this._speak()
    })
  }

  clearQueue() {
    this._queue = {}
  }
}

module.exports = SpeechQueue
