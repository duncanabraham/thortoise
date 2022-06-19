const { shuffle } = require('./utils')

class Cell {
  constructor (options) {
    this.x = 0
    this.y = 0
    this.entryPoint = 0
    this.value = 0
    Object.assign(this, options)
  }
}
/**
 * The Solver class takes a binary maze and a currentPos {x,y} and endPos {x,y} and attempts to find a route
 * between the 2 points.
 *
 * The result is an array of objects, each containing the steps along the route.
 */
class Solver {
  constructor (thisMaze) {
    this.maze = thisMaze.maze
    this.width = thisMaze.width
    this.height = thisMaze.height
    this.currentPos = thisMaze.currentPos
    this.endPos = thisMaze.endPos
    this.solveRoute = []
  }

  get ruleSet () {
    return {
      N: { entryPoint: 4, yMove: -1, xMove: 0, direction: 1 },
      E: { entryPoint: 8, yMove: 0, xMove: 1, direction: 2 },
      S: { entryPoint: 1, yMove: 1, xMove: 0, direction: 4 },
      W: { entryPoint: 2, yMove: 0, xMove: -1, direction: 8 }
    }
  }

  /**
   * If the current position is the same as the end position, then the maze is solved
   * @param pos - The current position of the player
   * @returns A boolean value.
   */
  solved (pos) {
    return pos.x === this.endPos.x && pos.y === this.endPos.y
  }

  empty (mapPos) {
    return mapPos !== 1
  }

  _north (pos) {
    return pos.y > 0 && this.empty(this.maze[pos.y - 1][pos.x]) ? 1 : 0
  }

  _east (pos) {
    return pos.x < this.width - 1 && this.empty(this.maze[pos.y][pos.x + 1]) ? 2 : 0
  }

  _south (pos) {
    return pos.y < this.height - 1 && this.empty(this.maze[pos.y + 1][pos.x]) ? 4 : 0
  }

  _west (pos) {
    return pos.x > 0 && this.empty(this.maze[pos.y][pos.x - 1]) ? 8 : 0
  }

  valueAtThisPosition (pos) {
    return pos ? this._north(pos) + this._east(pos) + this._south(pos) + this._west(pos) : 0
  }

  /* Updating the nextCell and thisCell objects with the new values. */
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

  solver () {
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
    const directionSequence = shuffle(['N', 'E', 'S', 'W'])
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

  /**
   * It takes a row of numbers and returns a string of characters
   * @param r - the row of the maze
   * @returns A string of the map row.
   */
  _rowAsMap (r) {
    /**
     * 0 = corridor
     * 1 = wall
     * 2 = player
     * 3 = end point
     * 4 = blocked corridor
     */
    const cellTypes = [' ', '░', 'O', 'X', '.']
    let mapRow = cellTypes[1]
    r.split('').forEach(i => {
      mapRow += cellTypes[i]
    })
    return mapRow + cellTypes[1]
  }

  /**
   * It creates an array of length w + 2, fills it with the character '░', and then joins the array
   * into a string
   * @param w - width of the box
   * @returns A string of solid line characters.
   */
  _solidLine (w) {
    return new Array(w + 2).fill('░').join('')
  }

  /**
   * It clears the screen
   */
  _clearScreen () {
    process.stdout.write('\u001b[2J\u001b[0;0H')
  }

  /**
   * It clears the screen, prints a solid line, prints each row of the maze, and then prints another
   * solid line
   */
  show () {
    this._clearScreen()
    console.log(this._solidLine(this.width))
    this.maze.forEach(row => {
      console.log(this._rowAsMap(row))
    })
    console.log(this._solidLine(this.width))
  }

  /**
   * It solves the problem.
   * @param [n=1000] - The number of times to run the solver.
   * @returns The best solution found after n iterations.
   */
  solve (n = 500) {
    let best = []
    for (let i = 0; i < n; i++) {
      const result = this.solver()
      best = best.length === 0 || result.length < best.length ? result : best
    }
    return best
  }
}

module.exports = Solver
