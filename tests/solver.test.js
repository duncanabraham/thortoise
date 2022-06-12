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
  describe('when the _solidLine() method is called', () => {
    it('should return a row of ░ characters n+2 long', () => {
      const result = solver._solidLine(10)
      const expectedResult = '░░░░░░░░░░░░'
      expect(result.length).to.equal(12)
      expect(result).to.equal(expectedResult)
    })
  })
  describe('when the _rowAsMap() method is called', () => {
    it('should return the a string representation from the number array passed to it within bounding walls', () => {
      const testMaze = [0, 1, 2, 3, 4]
      const result = solver._rowAsMap(testMaze)
      const expectedResult = '░ ░OX.░'
      expect(result.length).to.equal(testMaze.length + 2)
      expect(result).to.equal(expectedResult)
    })
  })
  describe('when the _clearScreen() method is called', () => {
    let write
    let sequence = ''
    beforeEach(() => {
      write = process.stdout.write
      process.stdout.write = (seq) => { sequence = seq }
    })
    it('should send a clearScreen character sequence to stdout', () => {
      const expectedSequence = '\u001b[2J\u001b[0;0H'
      solver._clearScreen()
      process.stdout.write = write
      expect(sequence).to.equal(expectedSequence)
    })
  })
  describe('when the show() method is called', () => {
    let oldConsole
    let output = []
    let write
    let sequence = ''
    it('should output a string representation of the maze', () => {
      solver.maze = [
        '0010000100',
        '0000000000'
      ]
      solver.width=10
      solver.height=2
      write = process.stdout.write
      process.stdout.write = (seq) => { sequence = seq }
      oldConsole = console
      console = {
        log: (s) => {
          output.push(s)
        }
      }
      solver.show()
      console = oldConsole
      process.stdout.write = write
      oldConsole.log(solver)
      
      expect(output).to.equal(expectedOutput)
    })
  })
})
