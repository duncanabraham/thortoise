/* global describe, it, beforeEach */
const Feature = require('../lib/feature')
const { expect } = require('chai')

describe('the Feature class:', () => {
  describe('on instantiation', () => {
    let feature
    describe('when group is invalid', () => {
      it('should throw an error if not passed a group', () => {
        let errMessage = 'NO ERROR'
        try {
          feature = new Feature({})
        } catch (e) {
          errMessage = e
        }
        expect(errMessage).to.not.equal('NO ERROR')
        expect(errMessage.errorName).to.equal('INSTANTIATION ERROR')
        expect(errMessage.moduleName).to.equal('FEATURE')
        expect(errMessage.message).to.include('A feature must include a valid group')
      })
      it('should throw an error if not passed a valid group', () => {
        let errMessage = 'NO ERROR'
        try {
          feature = new Feature({ group: 'TEST' })
        } catch (e) {
          errMessage = e
        }
        expect(errMessage).to.not.equal('NO ERROR')
        expect(errMessage.errorName).to.equal('INSTANTIATION ERROR')
        expect(errMessage.moduleName).to.equal('FEATURE')
        expect(errMessage.message).to.include('TEST is not a valid group name:')
      })
      it('should NOT throw a group error if passed a valid group', () => {
        let errMessage = 'NO ERROR'
        try {
          feature = new Feature({ group: 'CONTROLLER' })
        } catch (e) {
          errMessage = e
        }
        expect(errMessage).to.not.equal('NO ERROR')
        expect(errMessage.errorName).to.equal('INSTANTIATION ERROR')
        expect(errMessage.moduleName).to.equal('FEATURE')
        expect(errMessage.message).to.not.include('group name:')
      })
    })
    describe('when type is invalid', () => {
      it('should throw an error if not passed a type', () => {
        let errMessage = 'NO ERROR'
        try {
          feature = new Feature({ group: 'CONTROLLER' })
        } catch (e) {
          errMessage = e
        }
        expect(errMessage).to.not.equal('NO ERROR')
        expect(errMessage.errorName).to.equal('INSTANTIATION ERROR')
        expect(errMessage.moduleName).to.equal('FEATURE')
        expect(errMessage.message).to.include('A feature must include a valid type')
      })
      it('should throw an error if not passed a valid type', () => {
        let errMessage = 'NO ERROR'
        try {
          feature = new Feature({ group: 'CONTROLLER', type: 'TEST' })
        } catch (e) {
          errMessage = e
        }
        expect(errMessage).to.not.equal('NO ERROR')
        expect(errMessage.errorName).to.equal('INSTANTIATION ERROR')
        expect(errMessage.moduleName).to.equal('FEATURE')
        expect(errMessage.message).to.include('TEST is not a valid group name:')
      })
      it('should NOT throw a type error if passed a valid type', () => {
        let errMessage = 'NO ERROR'
        try {
          feature = new Feature({ group: 'CONTROLLER', type: 'CORE' })
        } catch (e) {
          errMessage = e
        }
        expect(errMessage).to.not.equal('NO ERROR')
        expect(errMessage.errorName).to.equal('INSTANTIATION ERROR')
        expect(errMessage.moduleName).to.equal('FEATURE')
        expect(errMessage.message).to.not.include('type:')
      })
    })
    describe('when resumeHandler is invalid', () => {
      it('should throw an error if not passed a resumeHandler', () => {
        let errMessage = 'NO ERROR'
        try {
          feature = new Feature({ group: 'CONTROLLER', type: 'CORE' })
        } catch (e) {
          errMessage = e
        }
        expect(errMessage).to.not.equal('NO ERROR')
        expect(errMessage.errorName).to.equal('INSTANTIATION ERROR')
        expect(errMessage.moduleName).to.equal('FEATURE')
        expect(errMessage.message).to.include('A feature must include a resumeHandler')
      })
      it('should throw an error if not passed a valid resumeHandler', () => {
        let errMessage = 'NO ERROR'
        try {
          feature = new Feature({ group: 'CONTROLLER', type: 'CORE', resumeHandler: 'TEST' })
        } catch (e) {
          errMessage = e
        }
        expect(errMessage).to.not.equal('NO ERROR')
        expect(errMessage.errorName).to.equal('INSTANTIATION ERROR')
        expect(errMessage.moduleName).to.equal('FEATURE')
        expect(errMessage.message).to.include('A resumeHandler must be a function')
      })
      it('should NOT throw a resumeHandler error if passed a valid resumeHandler', () => {
        let errMessage = 'NO ERROR'
        try {
          feature = new Feature({ group: 'CONTROLLER', type: 'CORE', resumeHandler: () => {} })
        } catch (e) {
          errMessage = e
        }
        expect(errMessage).to.not.equal('NO ERROR')
        expect(errMessage.errorName).to.equal('INSTANTIATION ERROR')
        expect(errMessage.moduleName).to.equal('FEATURE')
        expect(errMessage.message).to.not.include('resumeHandler')
      })
    })
    describe('when pauseHandler is invalid', () => {
      it('should throw an error if not passed a pauseHandler', () => {
        let errMessage = 'NO ERROR'
        try {
          feature = new Feature({ group: 'CONTROLLER', type: 'CORE', resumeHandler: () => {} })
        } catch (e) {
          errMessage = e
        }
        expect(errMessage).to.not.equal('NO ERROR')
        expect(errMessage.errorName).to.equal('INSTANTIATION ERROR')
        expect(errMessage.moduleName).to.equal('FEATURE')
        expect(errMessage.message).to.include('A feature must include a pauseHandler')
      })
      it('should throw an error if not passed a valid pauseHandler', () => {
        let errMessage = 'NO ERROR'
        try {
          feature = new Feature({ group: 'CONTROLLER', type: 'CORE', resumeHandler: () => {}, pauseHandler: 'TEST' })
        } catch (e) {
          errMessage = e
        }
        expect(errMessage).to.not.equal('NO ERROR')
        expect(errMessage.errorName).to.equal('INSTANTIATION ERROR')
        expect(errMessage.moduleName).to.equal('FEATURE')
        expect(errMessage.message).to.include('A pauseHandler must be a function')
      })
      it('should NOT throw a pauseHandler error if passed a valid pauseHandler', () => {
        let errMessage = 'NO ERROR'
        try {
          feature = new Feature({ group: 'CONTROLLER', type: 'CORE', resumeHandler: () => {}, pauseHandler: () => {} })
        } catch (e) {
          errMessage = e
        }
        // Now there is no error because we instantiated with valid options
        expect(errMessage).to.equal('NO ERROR')
      })
    })
    describe('when the feature is valid', () => {
      beforeEach(() => {
        feature = new Feature({ group: 'CONTROLLER', type: 'CORE', resumeHandler: () => {}, pauseHandler: () => {} })
      })
      describe('when the core() getter is called', () => {
        it('should return "CORE"', () => {
          const result = Feature.core
          expect(result).to.equal('CORE')
        })
      })
      describe('when the optional() getter is called', () => {
        it('should return "OPTIONAL"', () => {
          const result = Feature.optional
          expect(result).to.equal('OPTIONAL')
        })
      })
      describe('when the state() getter is called', () => {
        describe('and pause and resume have never been called', () => {
          it('should return a state of "NOT CALLED"', () => {
            const result = feature.state
            expect(result).to.equal('NOT CALLED')
          })
        })
        describe('and pause has been called', () => {
          it('should have a state of "PAUSED"', () => {
            feature.pause()
            const result = feature.state
            expect(result).to.equal('PAUSED')
          })
        })
        describe('and resume has been called', () => {
          it('should have a state of "ACTIVE"', () => {
            feature.resume()
            const result = feature.state
            expect(result).to.equal('ACTIVE')
          })
        })
      })
    })
  })
})
