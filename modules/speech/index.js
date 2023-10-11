/**
 * Speech reads text that has been published to the "voice" redis channel and says it out loud.
 */

const redisPubSub = require('./lib/redisPubSub')

const SpeechQueue = require('./lib/speechQueue')
// eslint-disable-next-line no-unused-vars
// speedhQueue is an event handler for the redis channel "voice"

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



(async () => {
  const redisClient = await redisPubSub()
  const speechQueue = new SpeechQueue(redicClient) 
  console.log('Running Thortoise Speech Engine.  Listening to redis queue "voice"')
  setInterval(() => {}, 100000) // just keep busy
})()

