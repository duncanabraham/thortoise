const stringFromArgs = (args = []) => {
  return args.map(a => typeof a === 'object' ? JSON.stringify(a) : a)
    .join(' : ')
    .replace(/\n/g, ' ')
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
