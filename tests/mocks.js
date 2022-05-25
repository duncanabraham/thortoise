const counters = {
  makeServo: 0,
  exitHandler: 0,
  sweep: 0,
  to: 0,
  stopCount: 0,
  homeCount: 0,
  minCount: 0,
  maxCount: 0
}
const mockDriver = {
  makeServo: (options) => {
    counters.makeServo++
    return {
      ...options,
      sweep: () => {
        counters.sweep++
      },
      to: () => {
        counters.to++
      },
      min: () => {
        counters.minCount++
      },
      max: () => {
        counters.maxCount++
      },
      home: () => {
        counters.homeCount++
      },
      stop: () => {
        counters.stopCount++
      }
    }
  },
  exitHandler: () => { 
    counters.exitHandler++
  }
}


module.exports = {
  mockDriver,
  counters
}
