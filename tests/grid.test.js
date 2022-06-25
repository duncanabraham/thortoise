/* global describe, it, beforeEach */
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
    describe('when toArray() is called', () => {
      it('should return the coords as an array', () => {
        const point = coords(10, 20)
        const result = point.toArray()
        expect(result).to.deep.equal([10, 20])
      })
    })
    describe('when Equals() is called', () => {
      describe('when passed a coords with the same coordinates', () => {
        it('should return true', () => {
          const point = coords(10, 20)
          const testPoint = coords(10, 20)
          const result = point.equals(testPoint)
          expect(result).to.equal(true)
        })
      })
      describe('when passed a coords with different coordinates', () => {
        it('should return true', () => {
          const point = coords(10, 20)
          const testPoint = coords(20, 30)
          const result = point.equals(testPoint)
          expect(result).to.equal(false)
        })
      })
    })
    describe('when distanceTo() is called', () => {
      it('should calculate the distance from the current point to the provided point', () => {
        const point = coords(1, 2)
        const providedPoint = coords(5, 5)
        const result = point.distanceTo(providedPoint)
        expect(result).to.equal(5)
      })
    })
    describe('when bearingTo() is called', () => {
      it('should calculate the angle between the current location and the provided location as a bearing', () => {
        const expectedBearings = [
          { x1: 1, y1: 6, x2: 1, y2: 1, result: 0 }, // 0
          { x1: 1, y1: 6, x2: 6, y2: 1, result: 45 }, // 45
          { x1: 1, y1: 6, x2: 6, y2: 6, result: 90 }, // 90
          { x1: 1, y1: 1, x2: 6, y2: 6, result: 135 }, // 135
          { x1: 1, y1: 1, x2: 1, y2: 6, result: 180 }, // 180
          { x1: 6, y1: 1, x2: 1, y2: 6, result: 225 }, // 225
          { x1: 6, y1: 1, x2: 1, y2: 1, result: 270 }, // 270
          { x1: 6, y1: 6, x2: 1, y2: 1, result: 315 } // 315
        ]
        expectedBearings.forEach(bearing => {
          const point = coords(bearing.x1, bearing.y1)
          const providedPoint = coords(bearing.x2, bearing.y2)
          const result = point.bearingTo(providedPoint)
          expect(result).to.equal(bearing.result)
        })
      })
      describe('when slope() is called', () => {
        it('should calculate the slope of the line between the current point and the provided point', () => {
          const point = coords(1, 1)
          const providedPoint = coords(6, 6)
          const result = point.slope(providedPoint)
          expect(result).to.equal(1)
        })
        it('should calculate the slope of the line between the current point and the provided point', () => {
          const point = coords(1, 1)
          const providedPoint = coords(3, 6)
          const result = point.slope(providedPoint)
          expect(result).to.equal(2.5)
        })
      })
    })
    describe('when midPoint() is called', () => {
      it('should calculate the midpoint between 2 points', () => {
        const expectedPoints = [
          { x1: 1, y1: 1, x2: 1, y2: 7, result: coords(1, 4) },
          { x1: 1, y1: 1, x2: 5, y2: 3, result: coords(3, 2) },
          { x1: 5, y1: 3, x2: 1, y2: 1, result: coords(3, 2) }
        ]
        expectedPoints.forEach(point => {
          const point1 = coords(point.x1, point.y1)
          const point2 = coords(point.x2, point.y2)
          const result = point1.midPoint(point2)
          expect(result.equals(point.result)).to.equal(true)
        })
      })
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
    describe('when addPosition() is called', () => {
      it('should accept x and y coords and set the current position to a coords object', () => {
        const values1 = { type: 'lawn1', items: ['dandelion', 'grass', 'stone', 'bare patch'] }
        const gridItem = new GridItem(values1)
        gridItem.addPosition(20, 30)
        const expectedResult = new Coords(20, 30)
        expect(gridItem.position).to.deep.equal(expectedResult)
      })
    })
  })
  describe('the Grid class', () => {
    let item
    let grid
    let position
    const gridX = 3
    const gridY = 3
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

        expect(result[3]).to.deep.equal(expected1)
        expect(result[4]).to.deep.equal(expected2)
        expect(result[5]).to.deep.equal(expected3)
      })
    })
  })
})
