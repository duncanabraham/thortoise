/**
 * Ensure the value is within range for the servo angle: 0-180
 * @param {*} v 
 * @returns 
 */
const constrain = (v) => {
  if (v < 0) {
    v = 0
  }
  if (v > 180) {
    v = 180
  }
  return v
}

const pad = (v, s) => {
  while ((v + '').length < s) {
    v = ' ' + v
  }
  return v
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
  return c * (t /= d) * t * t + b;
}

module.exports = {
  constrain,
  pad,
  easeInOutQuad,
  easeInOutCubic,
  easeOutCubic,
  easeInCubic
}