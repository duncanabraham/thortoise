const { logfile } = require('./config')
const path = require('path')
const readline = require('readline')
const { exec } = require('child_process')
const fs = require('fs')

const CRLF = `${String.fromCharCode(13)}${String.fromCharCode(10)}`

class ThortoiseAI {
  constructor(screenSessionID) {
    this.screenSessionID = screenSessionID
    this.logFilePath = path.resolve(logfile)
    this.currentLines = []
    this._busy = false
    this.answer = ''
    this.thinkingPhrases = ['I\'m thinking about it...', 'Still thinking...', 'Almost there...', 'I don\'t have an answer yet...', 'Give me a moment...']
    this.phraseIndex = 0
  }

  get busy() {
    return this._busy
  }

  getNextThinkingPhrase() {
    this.phraseIndex = (this.phraseIndex + 1) % this.thinkingPhrases.length
    return this.thinkingPhrases[this.phraseIndex]
  }

  _monitorLogFile() {
    let rl
    const initializeReadline = () => {
      if (rl) {
        rl.close()
      }
      rl = readline.createInterface({
        input: fs.createReadStream(this.logFilePath),
        crlfDelay: Infinity
      })
      rl.on('line', (line) => {
        if (line) {
          const cleanedLine = line.replace(/\x1B[[@-_][0-?]*[ -/]*[@-~]/g, '')
          if (cleanedLine.trim() === '>') { // This is a prompt symbol, so treat the collected lines as a single answer.
            // this.currentLines.shift()
            // this.currentLines.shift()
            const fullAnswer = this.currentLines.join(CRLF)
            console.log('Setting new answer:', fullAnswer)
            if (fullAnswer) {
              this._busy = false
              this.answer = fullAnswer
              // You can process fullAnswer here
            }
            this.currentLines = []
          } else {
            this.currentLines.push(cleanedLine)
          }
        }
      })
    }

    fs.watch(this.logFilePath, (event, filename) => {
      if (event === 'change') {
        initializeReadline()
      }
    })

    initializeReadline()
  }

  _isProcessRunning() {
    return new Promise((resolve, reject) => {
      exec(`screen -ls | grep ${this.screenSessionID}`, (error, stdout, stderr) => {
        if (error) {
          this._busy = false
          reject(new Error(error))
        }
        if (stdout.includes(this.screenSessionID)) {
          resolve(true)
        } else {
          this._busy = false
          resolve(false)
        }
      })
    })
  }

  async sendQuestion(question) {
    this._busy = true
    this._monitorLogFile()
    fs.writeFileSync(this.logFilePath, '')
    this.answer = ''
    const isRunning = await this._isProcessRunning().catch(err => {
      console.error('Oh no... ', err)
      return false
    })
    if (isRunning) {
      const cmd = `screen -S ${this.screenSessionID} -X stuff "${question}${CRLF}"`;

      exec(cmd, (error, stdout, stderr) => {
        if (error || stderr) {
          console.error(`Error sending question: ${error || stderr}`)
          this._busy = false
        }
      })
    } else {
      console.error('Process is not running.')
      this.answer = 'Process is not running'
    }
  }

  getAnswer() {
    console.log('Current answer:', this.answer, 'Busy:', this._busy)  // Debugging log
    if (this._busy) {
      return this.getNextThinkingPhrase()
    } else {
      return this.answer
    }
  }
}


module.exports = ThortoiseAI
