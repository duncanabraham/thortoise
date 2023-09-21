/**
████████ ██   ██  ██████  ██████  ████████  ██████  ██ ███████ ███████
   ██    ██   ██ ██    ██ ██   ██    ██    ██    ██ ██ ██      ██
   ██    ███████ ██    ██ ██████     ██    ██    ██ ██ ███████ █████
   ██    ██   ██ ██    ██ ██   ██    ██    ██    ██ ██      ██ ██
   ██    ██   ██  ██████  ██   ██    ██     ██████  ██ ███████ ███████

   The thinking tortoise! Really? Maybe just another robot project

   Author:  Duncan Abraham <duncan@tydusolutions.co.uk>
   Date:    2022, 2023, ...
*/

const { createClient } = require('redis')
let redisClient

const setupRedis = async () => {
  redisClient = createClient({
    host: '127.0.0.1',
    port: 6379
  })
}

const Registry = require('./lib/registry')
global.registry = new Registry()

const Store = require('./lib/store')
const { options, api } = require('./config')
const Thortoise = require('./lib/thortoise')
const Controller = require('./lib/controller')
const express = require('express')
const bodyParser = require('body-parser')
const store = new Store()
const { pad, niceDate } = require('./lib/utils')
const log = require('./lib/log')

// When an error is logged display it to the console
store.attachHandler('ERRORS', (data) => {
  log.error(data)
})

store.attachHandler('INFO', (data) => {
  console.info(`${pad(data.key, 10, true)} ${pad(data.value, 80, true)} ${niceDate(data.time)}`)
})

const init = async () => {
  // TODO: do I need to initialise anything here?
  // Each module should be calling their init() methods on instantiation  
}

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(api.port, () => {
  store.append('INFO', `Thortoise is listening on port ${api.port}`)
});

(async () => {
  await setupRedis()
  redisClient.connect().then(async () => {
    await init()
    console.log('index: redisClient: ', redisClient)
    const thortoise = new Thortoise({ ...options, store, redisClient })
    this.controller = new Controller({ robot: thortoise, app, store })

    if (thortoise.verbose) {
      console.info(thortoise)
    }

    log.info('Starting ...')
    log.info()
    log.info('████████ ██   ██  ██████  ██████  ████████  ██████  ██ ███████ ███████')
    log.info('   ██    ██   ██ ██    ██ ██   ██    ██    ██    ██ ██ ██      ██')
    log.info('   ██    ███████ ██    ██ ██████     ██    ██    ██ ██ ███████ █████')
    log.info('   ██    ██   ██ ██    ██ ██   ██    ██    ██    ██ ██      ██ ██')
    log.info('   ██    ██   ██  ██████  ██   ██    ██     ██████  ██ ███████ ███████')
    log.info()
    log.info(new Date().toISOString())
    log.info()
    thortoise.start()
  })
})()
