const { createClient } = require('redis')

const loadRedis = async () => {
  const client = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect()

  await client.set('key', 'value')
  const value = await client.get('key')
  console.log('value: ', value)
  await client.disconnect()
}

loadRedis()

