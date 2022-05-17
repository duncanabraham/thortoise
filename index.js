const { version } = require('./package.json')

const options = {
  name: 'ThortBot',
  version
}

const Thortoise = require('./lib/thortoise')

const thortBot = new Thortoise(options)

console.log('thortBot: ', thortBot)
