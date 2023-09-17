/**
 * This works with the serial port!!
 */
require('./common.js')
const { SerialPort, ReadlineParser } = require('serialport')
const { delay } = require('../lib/utils')
require('../config')
const log = require('../lib/log.js')

const { SMSNUMBER } = process.env

const ser = new SerialPort({ path: '/dev/serial0', baudRate: 9600 })
const parser = new ReadlineParser()
ser.pipe(parser)
parser.on('data', log.info)
parser.on('error', log.error)

const chr = (c) => {
  return String.fromCharCode(c)
}

const getResponse = async (cmd) => {
  cmd = cmd + '\r'
  log.info(`CPU: ${cmd}`)
  ser.write(cmd)
  await delay(2000)
}

const gsmPrint = async (cmd, timeout) => {
  cmd = cmd + '\r'
  log.info(`CPU: ${cmd}`)
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
  await gsmPrint('Tortoise says Hi @ 9600 on serial0 from NODE!!', 2)
  await gsmEndCommand()
  await parser.removeListener('data', log.info)
}

run()
