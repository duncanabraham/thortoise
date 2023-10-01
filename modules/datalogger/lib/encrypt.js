const crypto = require('crypto')
const { cryptography } = require('../config')

const algorithm = cryptography.algorithm // replace with your algorithm
const password = cryptography.key // replace with your password or key
const salt = crypto.randomBytes(16)
const keySize = 32 // replace with key size suitable for your algorithm
const iv = crypto.randomBytes(16)
const secretKey = crypto.pbkdf2Sync(password, salt, 100000, keySize, 'sha512')

const encrypt = (text) => {
  console.log('encrypt this: ', text)
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

const decrypt = (hash) => {
  const [iv, content] = hash.split(':')
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'))
  const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()])
  return decrypted.toString()
}

module.exports = {
  encrypt,
  decrypt
}
