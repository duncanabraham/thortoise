/* global beforeEach, describe, it */
const Navigation = require('../lib/navigation')
const { coords, GridItem } = require('../lib/grid')
const { expect } = require('chai')
const enums = require('../lib/enums')

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
  describe('when solve() is called', () => {
    it('should work out a route from a start to an end position in 9 steps', () => {
      const fixedItem = new GridItem({ fixed: true, type: 'wall' })
      nav.add(coords(3, 2), fixedItem)
      nav.add(coords(3, 3), fixedItem)
      nav.add(coords(3, 4), fixedItem)
      nav.add(coords(2, 4), fixedItem)
      nav.add(coords(1, 4), fixedItem)

      nav.add(coords(3, 8), fixedItem)
      nav.add(coords(3, 7), fixedItem)
      nav.add(coords(3, 6), fixedItem)
      nav.add(coords(2, 6), fixedItem)
      nav.add(coords(1, 6), fixedItem)

      nav.add(coords(6, 8), fixedItem)
      nav.add(coords(6, 7), fixedItem)
      nav.add(coords(6, 6), fixedItem)
      nav.add(coords(7, 6), fixedItem)
      nav.add(coords(8, 6), fixedItem)

      nav.add(coords(6, 2), fixedItem)
      nav.add(coords(6, 3), fixedItem)
      nav.add(coords(6, 4), fixedItem)
      nav.add(coords(7, 4), fixedItem)
      nav.add(coords(8, 4), fixedItem)

      const start = coords(5, 5)
      const end = coords(2, 4)
      const result = nav.solve(start, end)
      // nav.solver.show()

      expect(result.length).to.equal(9)
    })
  })
  describe('when turnDirection() is called', () => {
    it('should return -1 if we need to turn anti-clockwise from 0 to 270', () => {
      nav.currentBearing = enums.NORTH
      const turnDirection = nav.turnDirection(enums.WEST)
      expect(turnDirection).to.equal(-1)
    })
    it('should return -1 if we need to turn anti-clockwise from 270 to 180', () => {
      nav.currentBearing = enums.WEST
      const turnDirection = nav.turnDirection(enums.SOUTH)
      expect(turnDirection).to.equal(-1)
    })
    it('should return 1 if we need to turn clockwise from 0 to 90', () => {
      nav.currentBearing = enums.NORTH
      const turnDirection = nav.turnDirection(enums.EAST)
      expect(turnDirection).to.equal(1)
    })
    it('should return 1 if we need to turn clockwise from 200 to 270', () => {
      nav.currentBearing = 200
      const turnDirection = nav.turnDirection(enums.WEST)
      expect(turnDirection).to.equal(1)
    })
    it('should know to go positive when at 355 and going to 5', () => {
      nav.currentBearing = 355
      const turnDirection = nav.turnDirection(5)
      expect(turnDirection).to.equal(1)
    })
    it('should know to go negative when at 5 and going to 355', () => {
      nav.currentBearing = 5
      const turnDirection = nav.turnDirection(355)
      expect(turnDirection).to.equal(-1)
    })
    it('should return 0 if the desired bearing equals the current bearing', () => {
      nav.currentBearing = enums.NORTH
      const turnDirection = nav.turnDirection(enums.NORTH)
      expect(turnDirection).to.equal(0)
    })
  })
  describe('when matchedBearing() is called', () => {
    it('should return true if the provided bearing equals the current bearing', () => {
      const result = nav.matchedBearing(0)
      expect(result).to.equal(true)
    })
    it('should return true if the provided bearing is one degree below the current bearing', () => {
      const result = nav.matchedBearing(359)
      expect(result).to.equal(true)
    })
    it('should return true if the provided bearing is one degree higher the current bearing', () => {
      const result = nav.matchedBearing(1)
      expect(result).to.equal(true)
    })
    it('should return false if the provied bearing is 2 degrees below the current bearing', () => {
      const result = nav.matchedBearing(358)
      expect(result).to.equal(false)
    })
    it('should return false if the provied bearing is 2 degrees below the current bearing', () => {
      const result = nav.matchedBearing(360)
      expect(result).to.equal(false)
    })
    it('should return false if the provied bearing is 2 degrees higher the current bearing', () => {
      const result = nav.matchedBearing(2)
      expect(result).to.equal(false)
    })
  })
})
