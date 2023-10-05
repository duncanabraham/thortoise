const { spawn } = require('child_process')
const { delay } = require('../lib/utils')

const modelPath = 'models/llama-2-7b-chat.Q8_0.gguf'  // Replace with the actual model path
const child = spawn('/home/duncan/Projects/llama.cpp/main', ['--interactive', '-m', modelPath])


const run = async () => {
  await delay(5000)
  // To send data to the child process
  child.stdin.write('Your input data here\n')

  // To receive data from the child process
  child.stdout.on('data', (data) => {
    console.log(`Received data: ${data.toString().trim()}`)
  })

  // Close event
  child.on('close', () => {
    console.log('Child process closed')
  })

}

run()
