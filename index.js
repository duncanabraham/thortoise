const { options, env: { JOHNNY_DRIVER }, api } = require('./config')
const Thortoise = require('./lib/thortoise')
const Controllers = require('./lib/controllers')
const express = require('express')
const bodyParser = require('body-parser')
const JohnnyDriver = require(`./lib/${JOHNNY_DRIVER}.js`) // Allow development on a mock driver and running on the actual driver
const driver = new JohnnyDriver()

const init = async () => {
  await driver.initBoard()
}

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(api.port, () => {
  console.log(`Thortoise is listening on port ${api.port}`)
});

(async () => {
  init()

  const thortBot = new Thortoise({ ...options, driver, app })
  this.controllers = new Controllers({ robot: thortBot, app })

  console.info('thortBot: ', thortBot)

  thortBot.start()
})()
