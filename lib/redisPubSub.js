const { createClient } = require('redis')
let redisClient

const setupRedis = async () => {
  redisClient = createClient({
    host: '127.0.0.1',
    port: 6379
  })
}

module.exports = () => {
  return new Promise((resolve) => {
    setupRedis().then(() => {
      redisClient.connect()
    }).then(() => {
      return resolve(redisClient)
    })
  })
}
