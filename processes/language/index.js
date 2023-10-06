const express = require('express')
const { exec } = require('child_process')
const ThortoiseAI = require('./thortoiseAI')  // Assuming your ThortoiseAI class is in ThortoiseAI.js
const app = express()

const { port } = require('./config')

app.use(express.json())

let thortoiseAI

// Find the screen session ID and initialize ThortoiseAI
const initializeThortoise = () => {
  exec('screen -ls', (error, stdout, stderr) => {
    const match = stdout.match(/(\d+\.\w+-\d+\.\w+-\d+)/)

    if (match && match[1]) {
      thortoiseAI = new ThortoiseAI(match[1])
    } else {
      console.log("Screen session not found. Retrying in 5 seconds.")
      setTimeout(initializeThortoise, 5000)
    }
  })
}

// Initialize
initializeThortoise()

// Your API endpoint to ask a question
app.post('/ask', (req, res) => {
  if (thortoiseAI) {
    if (thortoiseAI.busy) {
      return res.status(503).json({ message: 'I\'m busy at the moment' })
    }
    const sanitizedQuestion = (req.body.question + '').replace(/(\r\n|\r|\n)/g, '')
    thortoiseAI.sendQuestion(sanitizedQuestion, req.body.id)
    res.json({ status: 'Question sent', id: req.body.id })
  } else {
    res.json({ status: 'ThortoiseAI not initialized' })
  }
})

// Your API endpoint to get an answer
app.get('/answer', (req, res) => {
  // Assume req.params.id contains the unique ID for the question
  if (thortoiseAI) {
    const answer = thortoiseAI.getAnswer()
    res.json({ answer })
  } else {
    res.json({ status: 'ThortoiseAI not initialized' })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})
