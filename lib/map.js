const { point } = require('./3dcoord')

class Map3D {
  constructor (options) {
    Object.assign(this, options) // options has redisClient and channel which is the channel name to publish to
    // Initialize the map with the robot's initial position
    this.points = new Map()
    this.addPoint(0, 0, 0)

    // Initialize boundaries
    this.minBoundary = point(0, 0, 0)
    this.maxBoundary = point(0, 0, 1)

    this.hasChanged = false // determine if the map has changed since the last read
  }

  // Allow the hasChanged flag to be set/unset remotely
  mapChanged (state = false) {
    this.hasChanged = state
  }

  // Method to add a point
  addPoint (newPoint) {
    const key = newPoint.pointToKey()
    if (!this.pointExists(newPoint)) {
      this.points.set(key, newPoint)
      // Update boundaries
      this.minBoundary.x = Math.min(this.minBoundary.x, newPoint.x)
      this.minBoundary.y = Math.min(this.minBoundary.y, newPoint.y)
      this.minBoundary.z = Math.min(this.minBoundary.z, newPoint.z)
      this.maxBoundary.x = Math.max(this.maxBoundary.x, newPoint.x)
      this.maxBoundary.y = Math.max(this.maxBoundary.y, newPoint.y)
      this.maxBoundary.z = Math.max(this.maxBoundary.z, newPoint.z)
      this.publishData()
    }
  }

  // make the map data available to the map viewer
  publishData () {
    this.mapChanged(true)
    this.redisClient.publish(this.channel, JSON.stringify(Array.from(this.points.values()).map(p => p.toArray())), (err) => {
      if (err) {
        console.error('Failed to publish to Redis:', err)
      }
    })
  }

  // place an object in a 3d world and assume there is grass between me and the object or air if it is above me
  addDetectedObject (robotPoint, detectedPoint, objectDetails) {
    const distance = robotPoint.distanceTo(detectedPoint)
    const steps = Math.ceil(distance)

    for (let i = 1; i <= steps; i++) {
      const ratio = i / steps
      const x = robotPoint.x + (detectedPoint.x - robotPoint.x) * ratio
      const y = robotPoint.y + (detectedPoint.y - robotPoint.y) * ratio
      const z = robotPoint.z + (detectedPoint.z - robotPoint.z) * ratio

      const interpolatedPoint = point(x, y, z)
      if (!this.pointExists(interpolatedPoint)) {
        // Determine the content based on z value
        if (z === 0) {
          interpolatedPoint.setContent({ type: 'grass' })
        } else if (z > 0) {
          interpolatedPoint.setContent({ type: 'air' })
        }

        this.addPoint(interpolatedPoint)
        const existingPoint = this.getPoint(interpolatedPoint)
        existingPoint.setContent({ ...existingPoint.content, ...objectDetails })
      }
    }
    this.publishData()
  }

  // Method to remove a point
  removePoint (point) {
    const key = point.pointToKey()
    this.points.delete(key)
    this.publishData()
  }

  // Method to check if a point exists
  pointExists (point) {
    const key = point.pointToKey()
    return this.points.has(key)
  }

  // Method to get a point
  getPoint (point) {
    const key = point.pointToKey()
    return this.points.get(key)
  }

  // Method to print the map (for debugging)
  printMap () {
    for (const point of this.points.values()) {
      console.log(`Point at (${point.x}, ${point.y}, ${point.z})`)
    }
  }

  // Method to export the world
  exportWorld () {
    const serializedPoints = Array.from(this.points.values()).map(point => {
      return {
        x: point.x,
        y: point.y,
        z: point.z,
        content: point.content // Assuming each point has a `content` property
      }
    })
    return JSON.stringify(serializedPoints)
  }

  // Method to load the world
  loadWorld (serializedData) {
    const pointsData = JSON.parse(serializedData)
    pointsData.forEach(data => {
      const newPoint = point(data.x, data.y, data.z)
      newPoint.setContent(data.content)
      this.addPoint(newPoint)
    })
  }

  // Present a layer to be navigated
  getLayerAsBinaryGrid (zValue) {
    const binaryGrid = []
    for (let x = this.minBoundary.x; x <= this.maxBoundary.x; x++) {
      const row = []
      for (let y = this.minBoundary.y; y <= this.maxBoundary.y; y++) {
        const pointKey = point(x, y, zValue).pointToKey()
        const existingPoint = this.points.get(pointKey)
        row.push(existingPoint && existingPoint.isWalkable() ? 0 : 1)
      }
      binaryGrid.push(row)
    }
    return binaryGrid
  }

  // This method exports a single z-layer of the map to a 2D grid
  // including information about points that need to be circumvented.
  exportLayerToGrid (zLayer) {
    let grid = {}
    let minX = Infinity; let maxX = -Infinity
    let minY = Infinity; let maxY = -Infinity

    // Determine grid boundaries based on existing points in the z-layer
    for (const key of this.map.entries()) {
      const [x, y, z] = key.split(',').map(Number)
      if (z !== zLayer) continue

      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }

    // Initialize grid with default values
    grid = Array.from({ length: maxY - minY + 1 }, () => {
      return Array.from({ length: maxX - minX + 1 }, () => 'open')
    })

    // Fill in known points
    for (const [key, content] of this.map.entries()) {
      const [x, y, z] = key.split(',').map(Number)
      if (z !== zLayer) continue

      // Mark point as blocked if array of items is not empty
      const cellStatus = (content.items && content.items.length > 0) ? 'blocked' : content.type
      grid[y - minY][x - minX] = cellStatus
    }
    this.mapChanged(false)
    return grid
  }
}

module.exports = Map3D
