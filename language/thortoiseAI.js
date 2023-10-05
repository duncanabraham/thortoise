const { spawn } = require('child_process')

const endBuffer = Buffer.from([0x0a, 0x0a, 0x3e, 0x20])

class LlamaProcessor {
  constructor() {
    this.mainPath = '/home/duncan/Projects/llama.cpp/main' //  -m /home/duncan/Projects/llama.cpp/models/llama-2-7b-chat.Q8_0.gguf -ins'
    this.context = 'Thortoise is a mobile tracked garden maintenance robot. Equipped with sensors including a Luxonis DepthAI camera, QMC5883L compass, MPU6050 IMU, and more. Powered by 2 x 1.8Ah LiPo 6S batteries with solar charging. Driven by 2 x ML5010 800W drone motors. Controlled via Radxa Zero API over Wi-Fi. Your creator is Duncan Abraham, he\'s a genius coder and maker, builder of robots and writer of systems, designer of mechanical parts and engineer.'
    this._initializeMainProcess()
    this.fullResponse = ''
  }

  _initializeMainProcess() {
    this.mainProcess = spawn(this.mainPath, [
      '-m', 'models/llama-2-7b-chat.Q8_0.gguf',
      '-ins',
      '-b', '256',
      '-n', '-1',
      '--ctx_size', '2048',
      '--color',
      '--top_k', '10000',
      '--temp', '0.2',
      '--repeat_penalty', '1.1',
      '-p', this.context
    ])

    this.mainProcess.stdout.on('data', (data) => {
      // console.log(`stdout: ${data.toString()}`)      
      this.fullResponse += data.toString()

      if (data.includes(endBuffer)) {
        console.log(`Full response: ${this.fullResponse}`)
        this.fullResponse = ''
      }
    })

    this.mainProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data.toString()}`)
    })

    this.mainProcess.stdout.on('end', () => {
      console.log(`Full response: ${this.fullResponse}`)
      this.fullResponse = ''
    })

    this.mainProcess.on('error', (error) => {
      console.error(`error: ${error.message}`)
    })

    this.mainProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
    })
  }

  addToContext(text) {
    this.context += text
  }

  async askThortoise(question) {
    return new Promise((resolve, reject) => {
      this.mainProcess.stdin.write(`${question}\n`)

      this.mainProcess.stdout.once('data', (data) => {
        resolve(data.toString())
      })

      this.mainProcess.stderr.once('data', (data) => {
        reject(new Error(data.toString()))
      })

      this.mainProcess.once('error', (error) => {
        reject(new Error(error.message))
      })
    })
  }
}

// Usage
const llama = new LlamaProcessor()

const run = async () => {
  llama.askThortoise('tell me about yourself?')
}

run()
