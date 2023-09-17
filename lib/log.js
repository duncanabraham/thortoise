const stringFromArgs = (args = []) => {
  let result = ''
  args.forEach(a => {
    if (typeof a === 'object') {
      a = JSON.stringify(a)
    }
    result += a + ' : '
  })
  return result.replace(/\n/g, ' ')
}

const timestamp = () => {
  return Date.now()
}

module.exports = {
  error: (...rest) => {
    const message = Array.from(rest)
    process.stderr.write(`${timestamp()} : ${stringFromArgs(message)}\n`)
  },
  info: (...rest) => {
    const message = Array.from(rest)
    process.stdout.write(`${timestamp()} : ${stringFromArgs(message)}\n`)
  }
}
