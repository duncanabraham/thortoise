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
    this.impossible = { x: -1, y: -1, entryPoint: -1, value: -1, message: 'Impossible maze' }
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

  solve() {
    let counter = 1
    // Start position
    const cellValue = this.valueAtThisPosition(this.currentPos)
    this.solveRoute.push(new Cell({ x: this.currentPos.x, y: this.currentPos.y, value: cellValue, counter: 0, entryPoint: 0 }))
    let nextCell = this.solveRoute[0]
    let thisCell
    while (!this.solved(nextCell) && counter < this.width * this.height) {
      thisCell = this.solveRoute.pop()

      nextCell = {
        x: thisCell.x,
        y: thisCell.y
      }

      if (thisCell.value & 1 && thisCell.entryPoint !== 4) {
        nextCell.y--
        nextCell.entryPoint = 1
        thisCell.value = thisCell.value - 1
      } else if (thisCell.value & 2 && thisCell.entryPoint !== 8) {
        nextCell.x++
        nextCell.entryPoint = 2
        thisCell.value = thisCell.value - 2
      } else if (thisCell.value & 4 && thisCell.entryPoint !== 1) {
        nextCell.y++
        nextCell.entryPoint = 4
        thisCell.value = thisCell.value - 4
      } else if (thisCell.value & 8 && thisCell.entryPoint !== 2) {
        nextCell.x--
        nextCell.entryPoint = 8
        thisCell.value = thisCell.value - 8
      }

      if (thisCell.x !== nextCell.x || thisCell.y !== nextCell.y) {
        nextCell.counter = counter
        nextCell.value = this.valueAtThisPosition(nextCell)
        this.solveRoute.push(thisCell)
        this.solveRoute.push(new Cell(nextCell))
      }

      counter++
    }
  
    return this.solveRoute
  }
}

module.exports = Solver
