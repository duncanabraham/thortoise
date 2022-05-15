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
  while ((v+'').length < s) {
    v = ' ' + v
  }
  return v
}

module.exports = {
  constrain,
  pad
}