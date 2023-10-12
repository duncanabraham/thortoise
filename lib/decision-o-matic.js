const crypto = require('crypto')

class DecisionOMatic {
  _randomometer(n) {
    return crypto.randomBytes(4).readUInt32BE(0) % n    
  }

  decisionCoinToss() {
    return !!this._randomometer(2)
  }

  decisionNumber(maxN) {
    return this._randomometer(maxN)
  }

  decisionAction(actionList) {
    return actionList[this._randomometer(actionList.length)]
  }

  decisionFunction(functionList) {
    const func = functionList[this._randomometer(functionList.length)]
    return func()
  }
}

module.exports = DecisionOMatic

