/**
 * Speech reads text that has been published to the "voice" redis channel and says it out loud.
 */

const redisPubSub = require('../../lib/redisPubSub')

const SpeechQueue = require('./lib/speechQueue')

  ; (async () => {
    // speechQueue is an event handler for the redis channel "voice"
    process.on('SIGINT', () => {
      console.log('Received SIGINT. Cleaning up before exit.')
      // Insert any cleanup code here
      process.exit(0)
    })

    process.on('uncaughtException', (err) => {
      console.error(`Uncaught Exception: ${err}`)
      process.exit(1)
    })

    process.on('unhandledRejection', (reason, p) => {
      console.error(`Unhandled Rejection at: Promise ${p}, reason: ${reason}`)
      process.exit(1)
    })

    const redisClient = await redisPubSub()
    // eslint-disable-next-line no-unused-vars
    const speechQueue = new SpeechQueue({ redisClient })
    console.log('\x1b[32mRunning Thortoise Speech Engine\x1b[0m.\nListening to redis queue "voice"')
    setInterval(() => { }, 100000) // just keep busy
  })()

