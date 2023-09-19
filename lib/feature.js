
/**
 * A feature is a component part of the system. Each should have a low-power pause option.
 *
 * A feature can be CORE ie required or OPTIONAL ie can be shutdown to save power
 *
 * The thortoise should have a manifest or registry of features which it can bring up and down depending on need and current power
 * status.
 *
 * All attached devices should use this as a base class to allow themselves to be registerable
 */
const { v4: uuid } = require('uuid')

const { INVALID_FEATURE } = require('./errors')

const validGroups = ['SYSTEM', 'POWER', 'SENSOR', 'CAMERA', 'STATUS', 'AUDIO', 'CONTROLLER', 'HAT', 'MOTION']

const validTypes = ['CORE', 'OPTIONAL']

class Feature {
  static validStates = {
    PAUSED: 0,
    ACTIVE: 1,
    NOT_CALLED: 2
  }

  constructor (options = {}) {
    this._featureState = Feature.validStates.NOT_CALLED
    Object.assign(this, options)
    !this._isValid && this._instantiationError()
    this._id = uuid()
    global.registry.register(this)
  }

  static get core () {
    return validTypes[0]
  }

  static get optional () {
    return validTypes[1]
  }

  _instantiationError () {
    const err = (!('group' in this) && INVALID_FEATURE('FEATURE', 'A feature must include a valid group')) ||
    ((!validGroups.includes(this.group)) && INVALID_FEATURE('FEATURE', `${this.group} is not a valid group name: [${validGroups}]`)) ||
    (!('type' in this) && INVALID_FEATURE('FEATURE', 'A feature must include a valid type')) ||
    ((!validTypes.includes(this.type)) && INVALID_FEATURE('FEATURE', `${this.type} is not a valid group name: [${validTypes}]`)) ||
    (!('resumeHandler' in this) && INVALID_FEATURE('FEATURE', 'A feature must include a resumeHandler')) ||
    ((typeof this.resumeHandler !== 'function') && INVALID_FEATURE('FEATURE', 'A resumeHandler must be a function')) ||
    (!('pauseHandler' in this) && INVALID_FEATURE('FEATURE', 'A feature must include a pauseHandler')) ||
    ((typeof this.pauseHandler !== 'function') && INVALID_FEATURE('FEATURE', 'A pauseHandler must be a function'))
    if (err) {
      throw err
    }
  }

  get _isValid () {
    return this.group &&
    this.type &&
    this.resumeHandler &&
    this.pauseHandler &&
    validGroups.includes(this.group) &&
    validTypes.includes(this.type) &&
    this.pauseHandler instanceof Function &&
    this.resume instanceof Function
  }

  get state () {
    return validStates[this._featureState]
  }

  resume () {
    this._featureState = 1
    this.resumeHandler()
  }

  pause () {
    this._featureState = 0
    this.pauseHandler()
  }
}

module.exports = Feature
