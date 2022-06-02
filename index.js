const { createClient } = require('redis')
const redisClient = createClient()

const { REDIS_CLIENT_CONNECT_ERROR, REDIS_CLIENT_GENERAL_ERROR } = require('./lib/errors')

const Store = require('./lib/store')
const { options, env: { JOHNNY_DRIVER }, api } = require('./config')
const Thortoise = require('./lib/thortoise')
const Controller = require('./lib/controller')
const express = require('express')
const bodyParser = require('body-parser')
const JohnnyDriver = require(`./lib/${JOHNNY_DRIVER}.js`) // Allow development on a mock driver and running on the actual driver
const driver = new JohnnyDriver()
const store = new Store()
const { pad, niceDate } = require('./lib/utils')

// When an error is logged display it to the console
store.attachHandler('ERRORS', (data) => {
  console.error(data)
})

store.attachHandler('INFO', (data) => {
  console.info(`${pad(data.key, 10, true)}  ${pad(data.value, 80, true)} ${niceDate(data.time)}`)
})

const init = async () => {
  await driver.initBoard()
  redisClient.on('error', (err) => {
    store.append('ERRORS', REDIS_CLIENT_GENERAL_ERROR('index', err))
  })
  await redisClient.connect().catch(err => {
    store.append('ERRORS', REDIS_CLIENT_CONNECT_ERROR('index', err))
  })
}

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(api.port, () => {
  store.append('INFO', `Thortoise is listening on port ${api.port}`)
});

(async () => {
  init()
  const thortBot = new Thortoise({ ...options, driver, store, redisClient })
  this.controller = new Controller({ robot: thortBot, app, store, redisClient })

  console.info(thortBot)

  thortBot.start()
})()
