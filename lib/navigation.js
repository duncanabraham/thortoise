const { coords, Grid, GridItem } = require('./grid')

class Navigation {
  contructor(options){
    Object.assign(this, options)
    const gridWidth = options.gridWidth || 500
    const gridLength = options.gridLength || 500
    this.world = new Grid(gridWidth, gridLength)
    this.position = coords(gridWidth / 2, gridLength / 2)
  }

  
}

module.exports=Navigation
