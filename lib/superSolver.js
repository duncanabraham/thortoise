class Solver {
  /**
   * options should contain the { map, robotPosition, targetPosition }
   * @param {*} options
   */
  constructor (options) {
    Object.assign(this, options)
    this.cachedPath = null
  }

  empty (cell) {
    return cell.type !== 'wall' && (!cell.items || cell.items.length === 0)
  }

  heuristic (start, end) {
    return Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2)
  }

  findLowestFScoreNode (openSet) {
    return openSet.sort((a, b) => a.g + a.h - (b.g + b.h)).shift()
  }

  generateNeighbours (current) {
    return [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 }
    ]
  }

  isNodeInSet (node, set) {
    return set.some(cell => cell.x === node.x && cell.y === node.y)
  }

  evaluateNeighbour (current, neighbor, openSet) {
    const tentativeG = current.g + 1
    const cell = this.map[neighbor.y][neighbor.x]

    if (this.empty(cell)) {
      let inOpenSetIndex = -1
      const inOpenSet = openSet.some((cell, index) => {
        if (cell.x === neighbor.x && cell.y === neighbor.y) {
          inOpenSetIndex = index
          return true
        }
        return false
      })

      if (inOpenSet && openSet[inOpenSetIndex].g > tentativeG) {
        openSet[inOpenSetIndex].g = tentativeG
      } else if (!inOpenSet) {
        openSet.push({ ...neighbor, g: tentativeG, h: this.heuristic(neighbor, this.targetPosition) })
      }
    }
  }

  setRobotPosition (newPosition) {
    this.robotPosition = newPosition
    this.cachedPath = null // Invalidate any stored paths
  }

  setTargetPosition (newPosition) {
    this.targetPosition = newPosition
    this.cachedPath = null // Invalidate any stored paths
  }

  solve () {
    if (this.cachedPath && !this.map.hasChanged) {
      return this.cachedPath
    }
    const openSet = [{ ...this.robotPosition, g: 0, h: this.heuristic(this.robotPosition, this.targetPosition) }]
    const closedSet = []
    const cameFrom = new Map()

    while (openSet.length > 0) {
      let current = this.findLowestFScoreNode(openSet)

      if (current.x === this.targetPosition.x && current.y === this.targetPosition.y) {
        // Reconstruct the path and return it
        const path = [current]
        while (cameFrom.has(current)) {
          current = cameFrom.get(current)
          path.push(current)
        }
        this.cachedPath = path.reverse()
        return this.cachedPath
      }

      closedSet.push(current)
      const neighbors = this.generateNeighbours(current)

      neighbors.forEach(neighbor => {
        if (!this.isNodeInSet(neighbor, closedSet)) {
          const newCost = current.g + 1
          if (!this.isNodeInSet(neighbor, openSet) || newCost < neighbor.g) {
            cameFrom.set(neighbor, current)
            neighbor.g = newCost
            neighbor.h = this.heuristic(neighbor, this.targetPosition)
            if (!this.isNodeInSet(neighbor, openSet)) {
              openSet.push(neighbor)
            }
          }
        }
      })
    }

    return null // No solution
  }

  nextMove () {
    const path = this.solve()
    if (path && path.length > 1) {
      return path[1] // The next step in the path (path[0] is the current position)
    }
    return null // Either no path exists, or we're already at the destination
  }
}

module.exports = Solver
