/* accept the incoming request and determine what to do with it by passing requests to the remote control module
    expected data structure:
    {
      "speedLeft": 0,
      "speedRight": 0,
      "statusLEDS": { "red": 1, "yellow": 1, "green": 1 },
      "state": 0
    }
    speeds are in % and range from -100% to +100%    
*/
module.exports = async (req, res) => {
  remote.setStatus({red:-1, yellow: 4, green: -1}) // flash yellow when a command is recieved
  const { log, remote, ready } = global.app
  if (ready) {
    const command = req.body
    log.info('HTTP request:', JSON.stringify(command))
    if (command.state) {
      await remote.setSpeed('left', command.speedLeft || 0)
      await remote.setSpeed('right', command.speedRight || 0)
    }
    // If the state value is 0 or both speeds are 0, call the stop method to ensure the motor controller is placed in idle mode
    (!command.state || (command.speedLeft === 0 && command.speedRight === 0)) && await remote.stop()
    // await remote.setStatus(command.statusLEDS || { red: 0, yellow: 0, green: 0 })
    remote.setStatus({red:-1, yellow: 0, green: -1})
    res.send('OK')
  } else {
    res.send('Not ready')
  }
}
