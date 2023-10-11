const redis = require('redis')
const { exec } = require('child_process')
const path = require('path')
const soundFiles = require('./sound.json')

class SpeechQueue {
  constructor(options) {
    this._queue = {}
    this.commandQueue = []
    this.currentlySpeaking = false
    this.processingCommand = false
    this.subscriber = options.redisClient.sub
    this._initializeRedis()
    this.maxAge = options.maxAge || 1000 * 60 * 3 // 3 minutes
  }

  async addToCommandQueue(command) {
    this.commandQueue.push(command)
    await this.processCommandQueue()
  }

  async processCommandQueue() {
    if (this.processingCommand || this.commandQueue.length === 0) {
      return
    }
    this.processingCommand = true
    const command = this.commandQueue.shift()
    await this._handleCommand(command.command, command.volume)
    this.processingCommand = false
    this.processCommandQueue()
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

  _handleCommand(command, volume) {
    if (command === 'CLEAR') {
      this.clearQueue()
    } else {
      if (soundFiles[command]) {
        const soundFile = path.join(__dirname, 'sounds', soundFiles[command])
        const playCommand = `sox -v ${volume} ${soundFile} -d`
        exec(`aplay ${soundFile}`, (error) => {
          if (error) {
            console.error(`Error in speaking: ${error}`)
            return
          }
        })
      }
    }
  }

  async _addMessageToQueue(message) {
    const voiceObject = JSON.parse(message)
    const { text, timestamp, command, volume = 1 } = voiceObject
    if (command) {
      await this.addToCommandQueue({ command, volume })
      return
    }
    const sanitizedText = this._validateAndSanitizeText(text)
    if (!sanitizedText) {
      console.error('Invalid text received')
      return
    }
    this._queue[timestamp] = sanitizedText
    // this._pruneOldMessages()
    if (!this.currentlySpeaking) {
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
    if (Object.keys(this._queue).length === 0) {
      return
    }
    this.currentlySpeaking = true
    const oldestTimestamp = Math.min(...Object.keys(this._queue))
    const textToSpeak = this._queue[oldestTimestamp]
    delete this._queue[oldestTimestamp]

    const voicePath = path.join(__dirname, 'voice', 'mycroft_voice_4.0.flitevox')
    const speakCommand = `mimic -voice ${voicePath} -t "${textToSpeak}"`
    exec(speakCommand, (error) => {
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
