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

module.exports = {
  error: (...rest) => {
    const message = Array.from(rest)
    console.error(stringFromArgs(message))
  },
  info: (...rest) => {
    const message = Array.from(rest)
    console.info(stringFromArgs(message))
  }
}
