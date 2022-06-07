const { SerialPort, ReadlineParser } = require('serialport')
const { delay } = require('../lib/utils')

const ser = new SerialPort({ path: '/dev/serial0', baudRate: 9600 })

const getResponse = async (cmd) => {
  cmd = cmd + '\r'
  console.log(`CPU: ${cmd}`)
  ser.write(cmd)
  await delay(10)
}

const gsmPrint = async (cmd, timeout) => {
  cmd = cmd + '\r'
  console.log(`CPU: ${cmd}`)
  ser.write(cmd)
  await delay(10)
}

const gsmEndCommand = async () => {
  ser.write(chr(26))
  await delay(1000)
}

getResponse('AT', 'OK', 2)
getResponse('AT+CMGF=1', 'OK', 2)
getResponse('AT+CMGS=\"xxxxxxxxxxxxxxx\"', 'OK', 2) // put your number replacing 'xxxxxxxxxxxxx'
gsmPrint('Tortoise says Hi @ 9600 on serial0', 2)
gsmEndcommand()