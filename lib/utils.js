/**
 * Resolve when ms milliseconds have ellapsed
 * @param {integer} ms
 * @returns {Promise}
 */
const delay = async (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

/**
 * Stretch a string to length
 * @param {*} str the string
 * @param {*} length the size to stretch it to
 * @param {*} reverse should we pad from the front or back
 * @returns a padded string
 */
const pad = (str, length, reverse = false) => {
  while ((str + '').length < length) {
    str = reverse ? str + ' ' : ' ' + str
  }
  return str
}

/**
 * Return a printable date and time
 * @param {Date} d
 * @returns A date string
 */
const niceDate = (d) => {
  const parts = d.toISOString().split('T')
  return `${parts[0]} ${parts[1].replace('Z', ' GMT')}`
}

/**
 * Shuffle the contents of an array
 * @param {Array} a
 * @returns {Array} the same Array but in a random order
 */
const shuffle = (a) => {
  return a.sort(function () { return 0.5 - Math.random() })
}

/**
 * Return a random number between 0 and n
 * @param {integer} n
 * @returns {integer}
 */
const random = (n) => {
  return Math.floor(Math.random() * n)
}

/**
 * @param {*} t time
 * @param {*} b beginning value
 * @param {*} c change in value
 * @param {*} d duration
 * @returns
 */
const easeInOutQuad = (t, b, c, d) => {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b
  return -c / 2 * ((--t) * (t - 2) - 1) + b
}

function easeInOutCubic (t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t + b
  return c / 2 * ((t -= 2) * t * t + 2) + b
}

function easeOutCubic (t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b
}

function easeInCubic (t, b, c, d) {
  return c * (t /= d) * t * t + b
}

module.exports = {
  pad,
  easeInOutQuad,
  easeInOutCubic,
  easeOutCubic,
  easeInCubic,
  delay,
  random,
  shuffle,
  niceDate
}
