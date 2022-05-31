const { expect } = require('chai')
const { coords, Grid, GridItem, Coords } = require('../lib/grid')

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
      const values = { type: 'lawn', items: ['dandelion', 'grass', 'stone', 'bare patch'] }
      const gridItem = new GridItem(values)
      expect(gridItem.type).to.equal('lawn')
    })
    describe('when match() is called', () => {
      it('should return a library of matching fields when comparing two items', () => {
        const values = { type: 'lawn', items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const gridItem = new GridItem(values)
        const testItem = new GridItem(values)
        const matchedItem = gridItem.match(testItem)
        expect(matchedItem.type).to.equal('matched')
        expect(matchedItem.items).to.equal('matched')
      })
      it('should return a library with a count field showing how many matches there were', () => {
        const values = { type: 'lawn', items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const gridItem = new GridItem(values)
        const testItem = new GridItem(values)
        expect(gridItem.match(testItem).count).to.equal(2)
      })
    })
    describe('when equals() is called', () => {
      it('should return true if the provided item matches the current item', () => {
        const values = { type: 'lawn', items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const gridItem = new GridItem(values)
        const testItem = gridItem
        expect(gridItem.equals(testItem)).to.equal(true)
      })
      it('should return false if the provided item do not match the current item', () => {
        const values1 = { type: 'lawn1', items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const values2 = { type: 'lawn2', items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const gridItem = new GridItem(values1)
        const testItem = new GridItem(values2)
        expect(gridItem.equals(testItem)).to.equal(false)
      })
    })
    describe('when like() is called', () => {
      it('should return true if the provided item matches 1 or more fields from the current item', () => {
        const values1 = { type: 'lawn1', items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const values2 = { type: 'lawn2', items: [] }
        const gridItem = new GridItem(values1)
        const testItem = new GridItem(values2)
        expect(gridItem.like(testItem)).to.equal(true)
      })
      it('should return false if the provided item does not match any fields from the the current item', () => {
        const values1 = { type: 'lawn1', items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const values2 = { type: 'lawn2', items: ['grass', 'stone', 'bare patch'] }
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
    let gridX = 3
    let gridY = 3
    beforeEach(() => {
      // override the id value as we need to test for it later
      item = new GridItem({ type: 'lawn1', items: ['dandelion', 'grass', 'stone', 'bare patch'], id: 'fdf9a21ca27731b86a239e2deea9cbc9' })
      grid = new Grid({ width: 10, length: 10 })
      position = coords(gridX, gridY)
      grid.add(position, item)
    })
    it('should instantiate with a grid the size of the supplied width and length values', () => {
      const width = 10
      const length = 10
      const grid = new Grid({ width, length })
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
      it('should return a GridItem if the grid contains a matching GridItem', () => {
        const result = grid.hasFeature(item)
        expect(result).to.be.an.instanceOf(GridItem)
      })
      it('should return undefined if there are no matching items', () => {
        const testItem = new GridItem({})
        const result = grid.hasFeature(testItem)
        expect(result).to.equal(undefined)
      })
      it('should return the x,y position of the found item', () => {
        const result = grid.hasFeature(item)
        expect(result.position).to.be.an.instanceOf(Coords)
        expect(result.position.x).to.equal(gridX)
        expect(result.position.y).to.equal(gridY)
      })
    })
    describe('when export() is called', () => {
      it('should return a JSON string representing the whole grid', () => {
        const result = grid.export()
        const expectedResult = '[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"id":"xxxx","type":"lawn1","items":["dandelion","grass","stone","bare patch"],"position":{"x":3,"y":3}},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]'
          .replace('xxxx', item.id)
        expect(result).to.equal(expectedResult)
      })
    })
    describe('when asBinaryGrid is called', () => {
      it('should return a binary grid for navigation', () => {
        const fixedItem = new GridItem({ fixed: true, type: 'wall' })

        grid.add(coords(3, 3), fixedItem)
        grid.add(coords(3, 4), fixedItem)
        grid.add(coords(3, 5), fixedItem)
        grid.add(coords(4, 5), fixedItem)
        grid.add(coords(5, 5), fixedItem)

        const result = grid.asBinaryGrid()

        const expected1 = [0, 0, 0, 1, 1, 1, 0, 0, 0, 0]
        const expected2 = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
        const expected3 = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
        console.log(result)
        expect(result[3]).to.deep.equal(expected1)
        expect(result[4]).to.deep.equal(expected2)
        expect(result[5]).to.deep.equal(expected3)
      })
    })
  })
})
