/**
 * This works with the serial port!!
 */
const { SerialPort, ReadlineParser } = require('serialport')
const { delay } = require('../lib/utils')
require('../config')

const { SMSNUMBER } = process.env

const ser = new SerialPort({ path: '/dev/serial0', baudRate: 9600 })
const parser = new ReadlineParser()
ser.pipe(parser)
parser.on('data', console.log)

const chr = (c) => {
  return String.fromCharCode(c)
}

const getResponse = async (cmd) => {
  cmd = cmd + '\r'
  console.log(`CPU: ${cmd}`)
  ser.write(cmd)
  await delay(2000)
}

const gsmPrint = async (cmd, timeout) => {
  cmd = cmd + '\r'
  console.log(`CPU: ${cmd}`)
  ser.write(cmd)
  await delay(2000)
}

const gsmEndCommand = async () => {
  ser.write(chr(26))
  await delay(2000)
}

const run = async () => {
  await getResponse('AT', 'OK', 2)
  await getResponse('AT+CMGF=1', 'OK', 2)
  await getResponse(`AT+CMGS="${SMSNUMBER}"`, 'OK', 2) // put your number in your .env file SMSNUMBER=+NNNNNNNNNNNN
  await gsmPrint('Tortoise says Hi @ 9600 on serial0', 2)
  await gsmEndCommand()
  parser.removeAllListeners() // TODO: not sure about this, parser has removeListener('data') which may be more appropriate
}

run()
