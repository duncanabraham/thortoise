const { options, env: { JOHNNY_DRIVER } } = require('./config')
const Thortoise = require('./lib/thortoise')
const JohnnyDriver = require(`./lib/${JOHNNY_DRIVER}.js`) // Allow development on a mock driver and running on the actual driver
const driver = new JohnnyDriver()

const init = async () => {
  await driver.initBoard()
}

(async () => {
  init()

  const thortBot = new Thortoise({ ...options, driver })
  console.info('thortBot: ', thortBot)

  thortBot.start()

})()
