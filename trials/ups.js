require('./common.js')
const UPS = require('../lib/i2c/UPS')  // Assuming UPS.js is in the same directory
const log = require('../lib/log') // Change to actual path

async function testUPS() {
  const ups = new UPS() // You may need to provide options and additional arguments based on your constructor
  
  try {
    console.log("Initializing...")
    ups.init()

    console.log("Reading Data...")
    await ups.readData()

    console.log("Data read:")
    console.log(ups.data)
  } catch (error) {
    log.error("An error occurred:", error)
  }
}

testUPS()
