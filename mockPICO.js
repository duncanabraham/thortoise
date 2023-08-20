const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const apiPort = 3010

app.post('/options', async (req, res) => {
  console.log('options: ', req.body)
  res.send(200, {})
})

app.get('status', async (req, res) => {
  console.log('status: ', req.query)
  res.send(200, {})
})

app.listen(apiPort, () => {
  console.log(`Thortoise MOCK API is listening on port ${apiPort}`)
})
