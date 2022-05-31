const delay = async (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

/**
 * Stretch a string to length
 * @param {*} v the string
 * @param {*} s the size to stretch it to
 * @param {*} rev should we pad from the front or back
 * @returns a padded string
 */
const pad = (v, s, rev = false) => {
  while ((v + '').length < s) {
    v = rev ? v + ' ' : ' ' + v
  }
  return v
}

/**
 * Shuffle the contents of an array
 * @param {Array} s 
 * @returns {Array} the same Array but in a random order
 */
const shuffle = (s) => {
  return s.sort(function () { return 0.5 - Math.random() })
}

const random = (n) => {
  return Math.random() * n
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

function easeInOutCubic(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t + b
  return c / 2 * ((t -= 2) * t * t + 2) + b
}

function easeOutCubic(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b
}

function easeInCubic(t, b, c, d) {
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
  shuffle
}
