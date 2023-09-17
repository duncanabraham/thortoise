const { log, remote } = global.app

/* accept the incoming request and determine what to do with it by passing requests to the remote control
    expected data structure:
    {
      "speedLeft": 0, // % of left speed
      "speedRight": 0, // % of right speed
      "statusLEDS": { "red": 1, "yellow": 1, "green": 1 },
      "state": 0
    }
*/
module.exports = async (req, res) => {
  const command = req.body
  log.info(JSON.stringify(command))
  if (command.state) {
    await remote.setSpeed('left', command.speedLeft || 0)
    await remote.setSpeed('right', command.speedRight || 0)
  }
  // If the state value is 0 or both speeds are 0, call the stop method to ensure the motor controller is placed in idle mode
  (!command.state || (command.speedLeft === 0 && command.speedRight === 0)) && remote.stop()
  await remote.setStatus(command.statusLEDS || { red: 0, yellow: 0, green: 0 })
  res.send('OK')
}
