const { expect } = require('chai')
const { coords, Grid, GridItem } = require('../lib/grid')

describe('the Grid class', () => {
  describe('the coords factory', () => {
    it('should accept an x and y value and store them', () => {
      const point = coords(10, 20)
      expect(point.x).to.equal(10)
      expect(point.y).to.equal(20)
    })
    it('should default to position 0,0 if no values are provided', () => {
      const point = coords()
      expect(point.x).to.equal(0)
      expect(point.y).to.equal(0)
    })
  })
  describe('the GridItem class', () => {
    it('should allow values to be stored as a gridItem', () => {
      const values = { type: 'lawn', coords: coords(10, 20), items: ['dandelion', 'grass', 'stone', 'bare patch'] }
      const gridItem = new GridItem(values)
      expect(gridItem.type).to.equal('lawn')
    })
    describe('when match() is called', () => {
      it('should return a library of matching fields when comparing two items', () => {
        const values = { type: 'lawn', coords: coords(10, 20), items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const gridItem = new GridItem(values)
        const testItem = new GridItem(values)
        const expectedMatchValue = {
          type: 'matched',
          coords: 'matched',
          items: 'matched',
          count: 3
        }
        expect(gridItem.match(testItem).type).to.equal('matched')
        expect(gridItem.match(testItem).coords).to.equal('matched')
        expect(gridItem.match(testItem).items).to.equal('matched')
      })
      it('should return a library count field showing how many matches there were', () => {
        const values = { type: 'lawn', coords: coords(10, 20), items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const gridItem = new GridItem(values)
        const testItem = new GridItem(values)
        expect(gridItem.match(testItem).count).to.equal(3)
      })
    })
    describe('when equals() is called', () => {
      it('should return true if the provided item matches the current item', () => {
        const values = { type: 'lawn', coords: coords(10, 20), items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const gridItem = new GridItem(values)
        const testItem = gridItem
        expect(gridItem.equals(testItem)).to.equal(true)
      })
      it('should return false if the provided item do not match the current item', () => {
        const values1 = { type: 'lawn1', coords: coords(10, 20), items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const values2 = { type: 'lawn2', coords: coords(10, 20), items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const gridItem = new GridItem(values1)
        const testItem = new GridItem(values2)
        expect(gridItem.equals(testItem)).to.equal(false)
      })
    })
    describe('when like() is called', () => {
      it('should return true if the provided item matches 1 or more fields from the current item', () => {
        const values1 = { type: 'lawn1', coords: coords(10, 20), items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const values2 = { type: 'lawn2', coords: coords(10, 20), items: [] }
        const gridItem = new GridItem(values1)
        const testItem = new GridItem(values2)
        expect(gridItem.like(testItem)).to.equal(true)
      })
      it('should return false if the provided item does not match any fields from the the current item', () => {
        const values1 = { type: 'lawn1', coords: coords(10, 20), items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const values2 = { type: 'lawn2', coords: coords(15, 20), items: ['grass', 'stone', 'bare patch'] }
        const gridItem = new GridItem(values1)
        const testItem = new GridItem(values2)
        expect(gridItem.equals(testItem)).to.equal(false)
      })
    })
  })
  describe('the Grid class', () => {
    let item
    let grid
    let position
    beforeEach(() => {
      // override the id value as we need to test for it later
      item = new GridItem({ type: 'lawn1', coords: coords(10, 20), items: ['dandelion', 'grass', 'stone', 'bare patch'], id: 'fdf9a21ca27731b86a239e2deea9cbc9'})
      grid = new Grid(10, 10)
      position = coords(3, 3)
      grid.add(position, item)
    })
    it('should instantiate with a grid the size of the supplied width and length values', () => {
      const width = 10
      const length = 10
      const grid = new Grid(width, length)
      expect(grid.grid.length).to.equal(100)
    })
    describe('when add() is called', () => {
      it('should allow a GridItem to be stored at a given x and y position', () => {
        expect(grid.grid[33]).to.equal(item)
      })
    })
    describe('when clear() is called', () => {
      it('should remove the values stored at a specified position', () => {
        grid.clear(position)
        expect(grid.grid[33]).to.equal(undefined)
      })
    })
    describe('when valueAt() is called', () => {
      it('should return the value stored at the specified position', () => {
        const value = grid.valueAt(position)
        expect(value).to.deep.equal(item)
      })
      it('should return undefined if the cell at the given position is empty', () => {
        const anotherPosition = coords(2, 2)
        const value = grid.valueAt(anotherPosition)
        expect(value).to.equal(undefined)
      })
    })
    describe('when hasFeature() is called', () => {
      it('should return true if the grid contains a matching GridItem', () => {
        const result = grid.hasFeature(item)
        expect(result).to.equal(true)
      })
      it('should return false if the grid does not contain a matching GridItem', () => {
        const testItem = new GridItem({})
        const result = grid.hasFeature(testItem)
        expect(result).to.equal(false)
      })
    })
    describe('when export() is called', () => {
      it('should return a JSON string representing the whole grid', () => {
        const result = grid.export()
        const expectedResult = '[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":"fdf9a21ca27731b86a239e2deea9cbc9","type":"lawn1","coords":{"x":10,"y":20},"items":["dandelion","grass","stone","bare patch"]},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]'
        expect(result).to.equal(expectedResult)
      })
    })
  })
})
