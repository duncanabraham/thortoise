const { createClient } = require('redis')
const redisClient = createClient()

const Store = require('./lib/store')
const { options, env: { JOHNNY_DRIVER }, api } = require('./config')
const Thortoise = require('./lib/thortoise')
const Controller = require('./lib/controller')
const express = require('express')
const bodyParser = require('body-parser')
const JohnnyDriver = require(`./lib/${JOHNNY_DRIVER}.js`) // Allow development on a mock driver and running on the actual driver
const driver = new JohnnyDriver()
const store = new Store()

const init = async () => {
  await driver.initBoard()
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect().catch(e => {
    console.error('Oops 1: ', e)
  })
}

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(api.port, () => {
  console.log(`Thortoise is listening on port ${api.port}`)
});

(async () => {
  init()
  const thortBot = new Thortoise({ ...options, driver, store, redisClient })
  this.controller = new Controller({ robot: thortBot, app, store, redisClient })

  console.info('thortBot: ', thortBot)

  thortBot.start()
})()
