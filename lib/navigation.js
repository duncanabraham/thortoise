const Solver = require('./solver')
const { coords, Grid, GridItem, Coords } = require('./grid')
class Navigation extends Grid {
  constructor(options = { length: 10, width: 10 }) {
    super(options)
    Object.assign(this, options)
    this.centreX = this.width / 2
    this.centreY = this.length / 2
    this.centre = coords(this.centreX, this.centreY)
  }

  update(coords, value) {
    const newValue = {
      ...this.valueAt(coords),
      ...value
    }
    this.add(coords, newValue)
  }

  solve(start, end) {
    const options = {
      maze: this.asBinaryGrid(),
      height: this.length,
      width: this.width,
      currentPos: start,
      endPos: end
    }
    const solver = new Solver(options)
    return solver.solve()
  }

  loadWorld(restore) {
    const { world } = restore
    Object.keys(world).forEach(key => {
      const restoreItem = new GridItem({ ...world[key], id: key })
      restoreItem.position = new Coords(restoreItem.position.x, restoreItem.position.y)
      this.add(restoreItem.position, restoreItem)
    })
  }

  worldToList() {
    return this.grid.reduce((prev, curr) => {
      if (curr && curr.id) {
        const id = curr.id
        const save = { ...curr }
        delete save.id
        prev[id] = save
        return prev
      }
    },
      {})
  }

  saveWorld() {
    const saveObj = {
      world: this.worldToList(),
      centre: this.centre,
      width: this.width,
      length: this.length
    }
    return JSON.stringify(saveObj)
  }
}

module.exports = Navigation
