const config = require('./config')
const Thortoise = require('./lib/thortoise')
const { JOHNNY_DRIVER } = process.env
const JohnnyDriver = require(`./lib/${JOHNNY_DRIVER}.js`)
const driver = new JohnnyDriver() // allows direct communication with the hardware

const init = async () => {
  await driver.initBoard() // wait for the board to initialise before we use it
}

(async () => {
  init()

  const { options } = config
  const thortBot = new Thortoise({ ...options, driver })

  console.info('thortBot: ', thortBot)

  thortBot.start()

})()
