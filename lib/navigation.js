const Solver = require('./superSolver')
const { Triplet } = require('./triplet')
const ICM20948 = require('./i2c/ICM20948')
const QMC5883L = require('./i2c/QMC5883L')
const GeoPoint = require('./geopoint')

// TODO: Values from ICM20948 which is registered globally

const GPS = require('./gps')
const Map3d = require('./map')
const { point } = require('./3dcoord')

class Navigation {
  constructor (options) {
    if (!options) {
      console.error('Invalid call to Navigation, please provide startup options')
      throw new Error('invalid call to Navigation constructor')
    }
    Object.assign(this, options)
    delete this.redisClient
    this.map = new Map3d({ redisClient: options.redisClient, channel: 'MAP_data' })
    this.imu = new ICM20948({ redisClient: options.redisClient, name: 'ICM20948', channel: 'ICM20948_data' })
    this.compass = new QMC5883L(options)
    this.centre = point(this.startX, this.startY, 1)
    this.currentPosition = this.centre
    this.placeObject(this.currentPosition, 'ROBOT')
    this.currentBearing = this.compass.bearing || 0
    this.geoPoint = new GeoPoint(-1, -1)
    this.gps = new GPS(this.geoPoint)
  }

  init () {
    // this.imu.setAccelRange(this.imu.ACCEL_RANGE_8G)
    // this.imu.run()
  }

  /**
   * It takes a set of coordinates and a value, and updates the value at those coordinates with the new
   * value
   * @param coords - The coordinates of the cell you want to update.
   * @param value - The value to be added to the grid.
   */
  update (coords, value) {
    const newValue = {
      ...this.valueAt(coords),
      ...value
    }
    this.add(coords, newValue)
  }

  /**
   * It creates a new Solver object, passing in the maze as a binary grid, the height and width of the
   * maze, the current position, and the end position
   * @param Point endPosition - The end position of the maze as a point.
   * @returns The solve method returns an array of arrays of coordinates.
   */
  solve (endPosition) {
    const solver = new Solver({
      map: this.map.exportLayerToGrid(1),
      robotPosition: this.currentPosition,
      targetPosition: endPosition
    })
    return solver.solve()
  }

  /**
   * It returns a string that represents the world
   * @returns A stringified version of the saveObj object.
   */
  saveWorld () {
    return this.map.exportWorld()
  }

  /**
   * It takes a restore object, loops through the world object in the restore object, creates a new
   * GridItem for each item in the world object, and adds the new GridItem to the grid
   * @param restore - The object that contains the world data.
   */
  loadWorld (restore) {
    this.map.loadWorld(restore)
  }

  /**
   * which way should I turn to get from my current bearing to "direction"
   * @param {ENUMS.direction} direction
   * @returns -1 || 1
   */
  turnDirection (direction) {
    if (this.currentBearing === direction) { return 0 }
    const diff = Math.sin(direction - this.currentBearing)
    return diff > 0 ? 1 : -1
  }

  /**
   * Return true if we're within a degree either side of our target - close enough :)
   * @param {INT} bearing
   * @returns Boolean
   */
  matchedBearing (bearing) {
    const cb = this.currentBearing
    const eachWay = new Triplet(bearing - 1, bearing, bearing + 1)
    if (eachWay.x < 0) {
      eachWay.x = eachWay.x + 360
    }
    if (eachWay.z > 359) {
      eachWay.z = eachWay.z - 360
    }
    return eachWay.x === cb || eachWay.y === cb || eachWay.z === cb
  }

  getValues () {
    return {
      // compassTemperature: this.compassTemperature,
      centre: this.centre,
      currentPosition: this.currentPosition,
      currentHeading: this.compass.heading,
      currentPitch: this.imu.pitch,
      currentRoll: this.imu.roll,
      gpsData: this.gps.data
    }
  }
}

module.exports = Navigation
