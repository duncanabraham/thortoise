const { expect } = require('chai')
const Camera = require('../lib/camera')

const results = {}

const mockSnapResolve = () => {
  return new Promise((resolve) => {
    results.resolveCalled = true
    resolve()
  })
}

const mockSnapReject = () => {
  return new Promise((resolve, reject) => {
    results.rejectCalled = true
    reject(new Error('test'))
  })
}

describe('the Camera class', () => {
  describe('the getImage() method', () => {
    let camera
    beforeEach(() => {
      camera = new Camera()
    })
    it('should call the snap() method of the underlying class', async () => {
      let snapCalled = false
      camera.snap = () => {
        return new Promise((resolve) => {
          snapCalled = true
          resolve()
        })
      }
      await camera.getImage()
      expect(snapCalled).to.equal(true)
    })
    describe('when the snap method is successful', () => {
      it('should call Promise.resolve()', async () => {
        camera.snap = mockSnapResolve
        await camera.getImage()
        expect(results.resolveCalled).to.equal(true)
      })
    })
    describe('when the snap method is NOT successful', () => {
      it('should call Promise.reject()', async () => {
        camera.snap = mockSnapReject
        let error
        await camera.getImage().catch(e => { error = e })
        expect(results.rejectCalled).to.equal(true)
      })
    })
  })
})
