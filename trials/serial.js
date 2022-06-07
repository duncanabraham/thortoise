const { SerialPort, ReadlineParser } = require('serialport')

const baud = [2400, 4800, 9600, 19200, 38400, 57600, 115200]

const parser = new ReadlineParser()

const delay = async (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const testValue = baud[1]

const run = async () => {
  const serialport = new SerialPort({ path: '/dev/ttyAMA0', baudRate: testValue })
  serialport.pipe(parser)
  parser.on('data', console.log)
  console.log(testValue)
  await serialport.write('AT\r\n')
  await delay(1000)
}

run()
