const stringFromArgs = (args = []) => {
  let result = ''
  args.forEach(a => {
    if (typeof a === 'object') {
      a = JSON.stringify(a)
    }
    result += a + ' : '
  })
  return result
}

const timestamp = () => {
  return Date.now()
}

module.exports = {
  error: (...rest) => {
    const message = Array.from(rest)
    console.error(timestamp(), ':', stringFromArgs(message))
  },
  info: (...rest) => {
    const message = Array.from(rest)
    console.info(timestamp(), ':', stringFromArgs(message))
  }
}
