const Navigation = require('../lib/navigation')
const { coords, GridItem } = require('../lib/grid')
const { expect } = require('chai')

describe('the Navigation class', () => {
  let nav
  let position
  let gridItem
  beforeEach(() => {
    nav = new Navigation({
      width: 10,
      length: 10
    })
    position = coords(3, 3)
    gridItem = new GridItem({
      name: 'test item'
    })
    nav.add(position, gridItem)
  })
  describe('when add() is called', () => {
    it('should store a GridItem at a location on the grid', () => {
      const value = nav.valueAt(position)
      const expectedValue = gridItem.clone()
      expect(value.equals(expectedValue)).to.equal(true)
    })
  })
  describe('when update() is called', () => {
    it('should add the provided values to the values already stored in the provided location', () => {
      const value = nav.valueAt(position)
      const expectedValue = gridItem.clone()
      expect(value.equals(expectedValue)).to.equal(true)
      const newValues = {
        animal: 'hamster',
        vegetable: 'carrot'
      }
      nav.update(position, newValues)
      const updatedValue = nav.valueAt(position)
      expect(updatedValue.animal).to.equal(newValues.animal)
      expect(updatedValue.vegetable).to.equal(newValues.vegetable)
    })
  })
  describe('when worldToList is called', () => {
    it('should return a summary of filled squares from the grid', () => {
      const list = nav.worldToList()
      const expectedValue = { name: 'test item', position: { x: 3, y: 3 } }
      expect(list[gridItem.id]).to.deep.equal(expectedValue)
    })
  })
  describe('when saveWorld() is called', () => {
    it('should return the current world as a JSON string', () => {
      const result = nav.saveWorld()
      const expectedResult = '{"world":{"xxxx":{"name":"test item","position":{"x":3,"y":3}}},"centre":{"x":5,"y":5},"width":10,"length":10}'.replace('xxxx', gridItem.id)
      expect(result).to.equal(expectedResult)
    })
  })
  describe('when loadWorld() is called', () => {
    it('should take a saved world and insert it into the current world', () => {
      const savedWorld = JSON.parse(nav.saveWorld())
      const newWorld = new Navigation({ width: 10, length: 10 })
      newWorld.loadWorld(savedWorld)
      const result = newWorld.valueAt(position)
      expect(result).to.deep.equal(gridItem)
    })
  })
  describe('when solve is called', () => {
    it('should work out a route from a start to an end position', () => {
      const fixedItem = new GridItem({ fixed: true, type: 'wall' })
      nav.add(coords(3, 3), fixedItem)
      nav.add(coords(3, 4), fixedItem)
      nav.add(coords(3, 5), fixedItem)
      nav.add(coords(4, 5), fixedItem)
      nav.add(coords(5, 5), fixedItem)

      const start = coords(4, 4)
      const end = coords(6, 2)
      const result = nav.solve(start, end)

      console.log(result)
    })
  })
})
