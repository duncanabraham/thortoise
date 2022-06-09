const { expect } = require('chai')
const Solver = require('../lib/solver')

const mockMaze = {
  maze: [],
  height: 10,
  width: 10,
  currentPos: { x: 0, y: 0 },
  endPos: { x: 9, y: 9 }
}

describe('the Solver class', () => {
  let solver
  beforeEach(() => {
    solver = new Solver(mockMaze)
  })
  describe('when the ruleSet method is called', () => {
    it('should return an object used for navigation', () => {
      const result = solver.ruleSet
      const expectedKeys = ['N', 'E', 'S', 'W']
      expect(Object.keys(result)).to.deep.equal(expectedKeys)
    })
  })
})
