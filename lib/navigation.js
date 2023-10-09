/*
This class handles where we are, and how to get to where we want to be
*/
const Solver = require('./superSolver')
const { Triplet } = require('./triplet')
const GeoPoint = require('./geopoint')
const Odometry = require('./odometry')
const Compass = require('./compass')
const GPS = require('./gps')

const fs = require('fs')

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
    this.compass = new Compass()
    this.centre = point(this.startX, this.startY, 1)
    this.currentPosition = this.centre
    this.map.addPoint(this.currentPosition, { name: 'ROBOT' })
    this.currentBearing = this.compass.bearing || 0
    this.geoPoint = new GeoPoint(-1, -1)
    this.odometry = new Odometry()
    this.gps = new GPS()
    this.gps.connect()
  }

  async init () {
    // this.imu.setAccelRange(this.imu.ACCEL_RANGE_8G)
    // this.imu.run()
    await this.compass.init()
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
   * Store the map in a file
   */
  saveWorld () {
    try {
      const map = this.map.exportWorld()
      fs.writeFileSync('mapdata.json', map)
    } catch (err) {
      console.error('Error saving world:', err)
    }
  }

  /**
   * Load a map from a backup file
   */
  async loadWorld () {
    try {
      const restore = await fs.readFile('mapdata.json', 'utf8')
      this.map.loadWorld(JSON.parse(restore))
    } catch (err) {
      console.error('Error loading world:', err)
    }
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
    const compassData = this.compass.read()
    const odom = {
      centre: this.centre,
      currentPosition: this.currentPosition,
      currentHeading: compassData.heading,
      currentPitch: compassData.pitch,
      currentRoll: compassData.roll
    }
    this.odometry.add(odom)
    return odom
  }
}

module.exports = Navigation
