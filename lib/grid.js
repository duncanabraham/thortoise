const Coords = require('./2dcoord')
const GridItem = require('./gridItem')

/* > A grid is a 2D array of items that can be added, removed and queried */
class Grid {
  constructor (options) {
    Object.assign(this, options)
    this.grid = new Array(this.width * this.length).fill(null)
  }

  _position (coords) {
    return coords.x * this.width + coords.y
  }

  _xy (position) {
    const x = Math.floor(position / this.width)
    const y = position % this.width
    return new Coords(x, y)
  }

  _generatePerspectiveSVG (grid, width, length) {
    let svg = '<svg width="1600" height="1600">'

    const offsetX = 300
    const offsetY = 400
    const perspectiveFactor = 0.9

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < length; j++) {
        const index = i * length + j
        const color = grid[index] ? 'blue' : 'grey'

        const x = j * 40
        const y = i * 40

        const perspX = x * Math.pow(perspectiveFactor, i)
        const perspY = y * Math.pow(perspectiveFactor, i)

        const nextPerspX = (j + 1) * 40 * Math.pow(perspectiveFactor, i)
        const nextPerspY = (i + 1) * 40 * Math.pow(perspectiveFactor, i)

        svg += `
          <polygon 
            points="${offsetX + perspX},${offsetY + perspY} 
                    ${offsetX + nextPerspX},${offsetY + perspY} 
                    ${offsetX + nextPerspX},${offsetY + nextPerspY} 
                    ${offsetX + perspX},${offsetY + nextPerspY}"
            style="fill:${color};stroke:black;stroke-width:1;"
          />`
      }
    }

    svg += '</svg>'
    return svg
  }

  /**
   * Return the grid as an HTML page to allow it to be easily visualised
   * @returns map as a web page
   */
  asSvgMap () {
    const svg = this._generatePerspectiveSVG(this.grid, this.width, this.length)
    return `<html><body>${svg}</body></html>`
  }

  /**
   * Return a grid as a binary maze which can be solved
   */
  asBinaryGrid () {
    const gridValues = new Array(this.width * this.length).fill(0)
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i] && this.grid[i].fixed) {
        gridValues[i] = 1
      }
    }
    const maze = []
    for (let j = 0; j < this.length; j++) {
      maze.push(gridValues.splice(0, this.width))
    }
    return maze
  }

  /**
   * Store a value at a position overwriting any previous value
   * @param {coords} coords where to store the item
   * @param {GridItem} value the values to store
   */
  add (coords, value) {
    value.position = coords
    this.grid[this._position(coords)] = value
  }

  _resizeGrid (newWidth, newLength, offsetX, offsetY) {
    const newGrid = new Array(newWidth * newLength).fill(null)

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.length; j++) {
        const oldIndex = i * this.length + j
        const newIndex = (i + offsetX) * newLength + (j + offsetY)
        newGrid[newIndex] = this.grid[oldIndex]
      }
    }

    this.grid = newGrid
    this.width = newWidth
    this.length = newLength
    this.coord.x += offsetX
    this.coord.y += offsetY
  }

  placeObject (coords, object) {
    let offsetX = 0; let offsetY = 0
    let newWidth = this.width; let newLength = this.length

    const { x, y } = coords

    if (x >= this.width || y >= this.length || x < 0 || y < 0) {
      if (x >= this.width || x < 0) {
        newWidth = Math.max(this.width, x + 1) * 2
        offsetX = Math.floor((newWidth - this.width) / 2)
      }
      if (y >= this.length || y < 0) {
        newLength = Math.max(this.length, y + 1) * 2
        offsetY = Math.floor((newLength - this.length) / 2)
      }

      this._resizeGrid(newWidth, newLength, offsetX, offsetY)
    }

    const index = (x + offsetX) * newLength + (y + offsetY)
    this.grid[index] = object
  }

  /**
   * Remove values stored at a specified location
   * @param {coords} coords where to remove the item
   */
  clear (coords) {
    this.grid[this._position(coords)] = undefined
  }

  /**
   * Return the value at a given x,y position
   * @param {Coords} coords
   * @returns {Griditem}
   */
  valueAt (coords) {
    return this.grid[this._position(coords)]
  }

  /**
   * Determine if an item exists in the grid
   * @param {*} item
   * @returns the found item
   */
  hasFeature (item) {
    return this.grid.find((i, index) => {
      if (i && i.equals(item)) {
        i.position = this._xy(index)
        return i
      } else {
        return null
      }
    })
  }

  export () {
    return JSON.stringify(this.grid)
  }
}

module.exports = {
  Grid,
  GridItem,
  coords: (x, y) => new Coords(x, y),
  Coords
}
