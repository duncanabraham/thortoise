const { createClient } = require('redis')
let redisClientSub
let redisClientPub

const setupRedis = async () => {
  redisClientSub = createClient({
    host: '127.0.0.1',
    port: 6379
  })
  redisClientPub = createClient({
    host: '127.0.0.1',
    port: 6379
  })
}

module.exports = () => {
  return new Promise((resolve) => {
    setupRedis().then(() => {
      redisClientSub.connect()
      redisClientPub.connect()
    }).then(() => {
      return resolve({ sub: redisClientSub, pub: redisClientPub })
    })
  })
}
