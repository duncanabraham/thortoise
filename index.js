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

const Registry = require('./lib/registry')
global.registry = new Registry()

const Store = require('./lib/store')
const { options, api } = require('./config')
const Thortoise = require('./lib/thortoise')
const Controller = require('./lib/controller')
const express = require('express')
const bodyParser = require('body-parser')
const store = new Store()
const log = require('./lib/log')
const redisPubSub = require('./lib/redisPubSub')

// When an error is logged display it to the console
store.attachHandler('ERRORS', (data) => {
  log.error(data)
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
  await init()
  const redisClient = await redisPubSub()
  const thortoise = new Thortoise({ ...options, store, redisClient, verbose: true })
  this.controller = new Controller({ robot: thortoise, app, store })

  function gracefulShutdown () {
    thortoise.shutdown()
    process.exit(0)
  }

  process.on('SIGINT', gracefulShutdown)
  process.on('SIGTERM', gracefulShutdown)

  if (thortoise.verbose) {
    console.log(thortoise)
  }

  log.info('Starting ...')
  log.info()
  log.info('\x1b[32m████████ ██   ██  ██████  ██████  ████████  ██████  ██ ███████ ███████\x1b[0m')
  log.info('\x1b[32m   ██    ██   ██ ██    ██ ██   ██    ██    ██    ██ ██ ██      ██\x1b[0m')
  log.info('\x1b[32m   ██    ███████ ██    ██ ██████     ██    ██    ██ ██ ███████ █████\x1b[0m')
  log.info('\x1b[32m   ██    ██   ██ ██    ██ ██   ██    ██    ██    ██ ██      ██ ██\x1b[0m')
  log.info('\x1b[32m   ██    ██   ██  ██████  ██   ██    ██     ██████  ██ ███████ ███████\x1b[0m')
  log.info()
  log.info(new Date().toISOString())
  log.info()
  thortoise.start()
})()
