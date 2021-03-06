const Solver = require('./solver')
const { Triplet } = require('./triplet')

// const ICM20948 = require('./ICM20948')
// GPS will go here

const { coords, Grid, GridItem, Coords } = require('./grid')
class Navigation extends Grid {
  constructor (options = { length: 10, width: 10 }) {
    super(options)
    Object.assign(this, options)
    // this.imu = new ICM20948() // we're going to use this module to give us a bearing
    this.centreX = this.width / 2
    this.centreY = this.length / 2
    this.centre = coords(this.centreX, this.centreY)
    this.currentPosition = this.centre
    this.currentBearing = 0
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
   * @param start - The starting position of the maze.
   * @param end - The end position of the maze.
   * @returns The solve method returns an array of arrays of coordinates.
   */
  solve (start, end) {
    const options = {
      maze: this.asBinaryGrid(),
      height: this.length,
      width: this.width,
      currentPos: start,
      endPos: end
    }
    this.solver = new Solver(options)
    return this.solver.solve()
  }

  /**
   * It takes a restore object, loops through the world object in the restore object, creates a new
   * GridItem for each item in the world object, and adds the new GridItem to the grid
   * @param restore - The object that contains the world data.
   */
  loadWorld (restore) {
    const { world } = restore
    Object.keys(world).forEach(key => {
      const restoreItem = new GridItem({ ...world[key], id: key })
      restoreItem.position = new Coords(restoreItem.position.x, restoreItem.position.y)
      this.add(restoreItem.position, restoreItem)
    })
  }

  /**
   * It takes the grid, which is a 2D array, and turns it into a 1D object
   * @returns An object with the id as the key and the object as the value.
   */
  worldToList () {
    return this.grid.reduce((prev, curr) => {
      const id = curr.id
      const save = { ...curr }
      delete save.id
      prev[id] = save
      return prev
    }, {})
  }

  /**
   * It returns a string that represents the world
   * @returns A stringified version of the saveObj object.
   */
  saveWorld () {
    const saveObj = {
      world: this.worldToList(),
      centre: this.centre,
      width: this.width,
      length: this.length
    }
    return JSON.stringify(saveObj)
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
}

module.exports = Navigation
