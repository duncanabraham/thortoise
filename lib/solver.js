const { shuffle } = require('./utils')

class Cell {
  constructor(options) {
    this.x = 0
    this.y = 0
    this.entryPoint = 0
    this.value = 0
    Object.assign(this, options)
  }

  get pos() {
    return { x: this.x, y: this.y }
  }
}
/**
 * The Solver class takes a binary maze and a currentPos {x,y} and endPos {x,y} and attempts to find a route
 * between the 2 points.
 * 
 * The result is an array of objects, each containing the steps along the route. 
 */
class Solver {
  constructor(thisMaze) {
    this.maze = thisMaze.maze
    this.width = thisMaze.width
    this.height = thisMaze.height
    this.currentPos = thisMaze.currentPos
    this.endPos = thisMaze.endPos
    this.solveRoute = []
  }

  get ruleSet () {
    return {
      'N': { entryPoint: 4, yMove: -1, xMove: 0, direction: 1 },
      'E': { entryPoint: 8, yMove: 0, xMove: 1, direction: 2 },
      'S': { entryPoint: 1, yMove: 1, xMove: 0, direction: 4 },
      'W': { entryPoint: 2, yMove: 0, xMove: -1, direction: 8 }
    }
  }

  solved(pos) {
    return pos.x === this.endPos.x && pos.y === this.endPos.y
  }

  empty(mapPos) {
    return mapPos !== 1
  }

  _north(pos) {
    return pos.y > 0 && this.empty(this.maze[pos.y - 1][pos.x]) ? 1 : 0
  }

  _east(pos) {
    return pos.x < this.width - 1 && this.empty(this.maze[pos.y][pos.x + 1]) ? 2 : 0
  }

  _south(pos) {
    return pos.y < this.height - 1 && this.empty(this.maze[pos.y + 1][pos.x]) ? 4 : 0
  }

  _west(pos) {
    return pos.x > 0 && this.empty(this.maze[pos.y][pos.x - 1]) ? 8 : 0
  }

  valueAtThisPosition(pos) {
    return pos ? this._north(pos) + this._east(pos) + this._south(pos) + this._west(pos) : 0
  }

  _lastCell() {
    return this.solveRoute.length > 0 ? this.solveRoute.pop() : this.solveRoute[0]
  }

  updateCells = (options) => {
    options.nextCell.y = options.nextCell.y + options.yMove
    options.nextCell.x = options.nextCell.x + options.xMove
    options.nextCell.entryPoint = options.direction
    options.thisCell.value = options.thisCell.value - options.direction

    options.nextCell.counter = options.counter
    options.nextCell.value = this.valueAtThisPosition(options.nextCell)
    this.solveRoute.push(options.thisCell)
    this.solveRoute.push(new Cell(options.nextCell))
    return true
  }

  solver() {
    let counter = 1
    this.solveRoute = []
    this.solveRoute.push(new Cell({
      x: this.currentPos.x,
      y: this.currentPos.y,
      value: this.valueAtThisPosition(this.currentPos),
      counter: 0,
      entryPoint: 0
    }))
    let nextCell = this.solveRoute[0]
    let thisCell
    const directionSequence = shuffle(['N','E','S','W'])
    while (!this.solved(nextCell) && counter < (this.width * this.height)) {
      thisCell = this.solveRoute.pop()
      nextCell = { x: thisCell.x, y: thisCell.y }

      let moved = false
      directionSequence.forEach(seq => {
        if (!moved && thisCell.value & this.ruleSet[seq].direction && thisCell.entryPoint !== this.ruleSet[seq].entryPoint) {
          moved = this.updateCells({ thisCell, nextCell, ...this.ruleSet[seq], counter })
        }
      })

      counter++
    }
    return this.solveRoute
  }

  _rowAsMap(r) {
    /**
     * 0 = corridor
     * 1 = wall
     * 2 = player
     * 3 = end point
     * 4 = blocked corridor
     */
    const cellTypes = [' ', '░', 'O', 'X', '.']
    let mapRow = cellTypes[1]
    r.forEach(i => {
      mapRow += cellTypes[i]
    })
    return mapRow + cellTypes[1]
  }

  _solidLine(w) {
    return new Array(w + 2).fill('░').join('')
  }

  _clearScreen() {
    process.stdout.write('\u001b[2J\u001b[0;0H')
  }

  show() {
    this._clearScreen()
    console.log(this._solidLine(this.width))
    this.maze.forEach(row => {
      console.log(this._rowAsMap(row))
    })
    console.log(this._solidLine(this.width))
  }

  /**
   * 
   * @param {integer} n how many times to run the solver
   * @returns {Array} an array containing the steps between the current and desired locations
   */
  solve(n = 1000) {
    let best = []
    for (let i = 0; i < n; i++) {
      const result = this.solver()
      best = best.length === 0 || result.length < best.length ? result : best
    }
    return best
  }
}

module.exports = Solver
